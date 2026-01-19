import type { CreateEventCategoryGroupInput } from '@ntlango/commons/types';

const eventCategoryGroups: CreateEventCategoryGroupInput[] = [
  {
    name: 'Entertainment',
    eventCategories: ['Concerts', 'Nightlife', 'Film & Media', 'Gaming', 'Fashion & Beauty', 'Arts & Culture'],
  },
  {
    name: 'Professional & Learning',
    eventCategories: ['Conferences', 'Workshops', 'Networking', 'Technology', 'Startup & Business', 'Education'],
  },
  {
    name: 'Health & Wellness',
    eventCategories: ['Fitness', 'Health & Wellness', 'Family & Kids', 'Religious & Spiritual'],
  },
  {
    name: 'Food & Lifestyle',
    eventCategories: ['Food & Drink', 'Fashion & Beauty', 'Travel & Adventure', 'Arts & Culture'],
  },
  {
    name: 'Sports & Outdoors',
    eventCategories: ['Sports', 'Fitness', 'Travel & Adventure'],
  },
  {
    name: 'Community & Causes',
    eventCategories: ['Charity & Causes', 'Religious & Spiritual', 'Family & Kids', 'Education'],
  },
];

export default eventCategoryGroups;
