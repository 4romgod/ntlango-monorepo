import { Box } from '@mui/material';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { getClient } from '@/data/graphql';
import {
  GetAllEventCategoriesDocument,
  GetAllEventsDocument,
  GetSocialFeedDocument,
  GetSocialFeedQuery,
  GetUserByIdDocument,
} from '@/data/graphql/types/graphql';
import { EventPreview } from '@/data/graphql/query/Event/types';
import { verifyAndDecodeToken } from '@/lib/utils';
import { HeroSection, FeaturedEvents, CategoryExplorer, SocialFeed } from '@/components/home';

export const metadata: Metadata = {
  title: {
    default: 'Ntlango',
    template: 'Ntlango',
  },
  icons: {
    icon: '/logo-img.png',
    shortcut: '/logo-img.png',
    apple: '/logo-img.png',
  },
};

// Enable ISR with 60-second revalidation for performance
export const revalidate = 60;

const SOCIAL_FEED_LIMIT = 4;

export default async function HomePage() {
  const session = await auth();
  const token = session?.user?.token;
  
  // Verify and decode token in one step
  const decoded = await verifyAndDecodeToken(token);
  const isAuth = decoded !== null;
  const userId = decoded?.userId ?? null;

  // Fetch user data for personalization (if authenticated)
  let userLocation: { city?: string; country?: string; latitude?: number; longitude?: number } | null = null;
  let userInterestIds: string[] = [];

  if (isAuth && userId) {
    try {
      const userResponse = await getClient().query({
        query: GetUserByIdDocument,
        variables: { userId },
        context: { headers: { token } },
      });
      const user = userResponse.data.readUserById;
      if (user?.location) {
        userLocation = {
          city: user.location.city,
          country: user.location.country,
          latitude: user.location.coordinates?.latitude,
          longitude: user.location.coordinates?.longitude,
        };
      }
      if (user?.interests && user.interests.length > 0) {
        userInterestIds = user.interests.map((i: { eventCategoryId: string }) => i.eventCategoryId);
      }
    } catch (error) {
      console.error('Unable to fetch user data for personalization', error);
    }
  }

  // Fetch events - personalized for authenticated users with location, all events otherwise
  let eventList: EventPreview[] = [];

  if (isAuth && userLocation) {
    // Fetch events filtered by user's location
    try {
      const eventsResponse = await getClient().query({
        query: GetAllEventsDocument,
        variables: {
          options: {
            location: {
              city: userLocation.city,
              country: userLocation.country,
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
            filters: userInterestIds.length > 0 
              ? [{ field: 'eventCategories', value: userInterestIds }]
              : undefined,
            pagination: { limit: 20 },
          },
        },
        context: { headers: { token } },
      });
      eventList = (eventsResponse.data.readEvents ?? []) as EventPreview[];
    } catch (error) {
      console.error('Unable to fetch personalized events, falling back to all events', error);
    }
  }

  // Fallback to all events if personalization fails or user has no location
  if (eventList.length === 0) {
    const eventsResponse = await getClient().query({ query: GetAllEventsDocument });
    eventList = (eventsResponse.data.readEvents ?? []) as EventPreview[];
  }

  // Fetch categories
  const { data } = await getClient().query({ query: GetAllEventCategoriesDocument });
  const eventCategories = data.readEventCategories?.slice(0, 6) ?? [];
  
  const featuredEvents = eventList.slice(0, 8);
  const heroEvent = eventList[0] ?? null;

  // Fetch social feed for authenticated users
  let socialFeed: GetSocialFeedQuery['readFeed'] = [];
  if (isAuth) {
    try {
      const feedResponse = await getClient().query<GetSocialFeedQuery>({
        query: GetSocialFeedDocument,
        variables: { limit: SOCIAL_FEED_LIMIT },
        context: {
          headers: {
            token: token,
          },
        },
      });
      socialFeed = feedResponse.data.readFeed ?? [];
    } catch (error) {
      console.error('Unable to load social feed', error);
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.default' }}>
      <HeroSection heroEvent={heroEvent} />
      <FeaturedEvents events={featuredEvents} />
      <CategoryExplorer categories={eventCategories} />
      <SocialFeed 
        isAuthenticated={isAuth} 
        hasToken={!!token} 
        socialFeed={socialFeed} 
      />
    </Box>
  );
}
