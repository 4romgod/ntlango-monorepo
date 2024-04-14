import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarIcon,
  CheckCircleIcon,
  TicketIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Event } from '@/lib/graphql/types/graphql';
import { Box } from '@mui/material';

export default function EventSmallBox({ event }: { event: Event }) {
  const {
    title,
    organizers,
    startDate,
    rSVPs,
    media: { featuredImageUrl },
  } = event;
  const organizersText =
    organizers?.map((user) => user.username).join(' and ') ?? '';

  return (
    <Link href={`/ntlango`}>
      <Box
        component="div"
        boxShadow={1}
        className="gap-2"
        sx={{
          display: { xs: 'flex' },
          flexDirection: { xs: 'row', md: 'column' },
          px: { xs: 1, md: 0 },
          py: { xs: 1, md: 0 },
          pb: { md: 3 },
          borderRadius: '0.375rem',
          height: '100%',
          width: '100%',
        }}
      >
        <Box
          component="div"
          sx={{
            width: { xs: '25%', md: '100%' },
            pt: { xs: 1, md: 0 },
          }}
        >
          <Image
            src={featuredImageUrl}
            alt="Event Image"
            width={500}
            height={500}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
            className="rounded"
          />
        </Box>
        <Box
          component="div"
          sx={{
            width: { xs: '75%', md: '100%' },
            pl: { md: 2 },
            pt: { md: 2 },
          }}
        >
          <Box component="div">
            <h4 className="text-xl font-bold">{title}</h4>
          </Box>
          <Box component="div" className="flex flex-row">
            <UserIcon className="mr-2 h-6 w-5" />
            <p className="text-base">{organizersText}</p>
          </Box>
          <Box component="div" className="flex flex-row">
            <CalendarIcon className="mr-2 h-6 w-5" />
            <p>{startDate}</p>
          </Box>
          <Box component="div" className="flex flex-row">
            <CheckCircleIcon className="mr-2 h-6 w-5" />
            <p>{rSVPs.length ?? 0} RSVP&lsquo;s</p>
          </Box>
          <Box component="div" className="flex flex-row">
            <TicketIcon className="mr-2 h-6 w-5" />
            <p>Free</p>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
