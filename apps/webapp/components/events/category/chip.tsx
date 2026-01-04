import { EventCategory } from '@/data/graphql/types/graphql';
import { getEventCategoryIcon } from '@/lib/constants';
import { Avatar, Chip } from '@mui/material';
import Link from 'next/link';

export default function EventCategoryChip({ category }: { category: EventCategory }) {
  const IconComponent = getEventCategoryIcon(category.iconName);
  return (
    <Link key={category.eventCategoryId} href={`/events#${category.name}`} passHref style={{ textDecoration: 'none' }}>
      <Chip
        avatar={
          <Avatar sx={{ bgcolor: `${category.color}20` }}>
            <IconComponent color={category.color ?? 'black'} width={20} height={20} />
          </Avatar>
        }
        label={category.name}
        variant="outlined"
        size="medium"
        clickable
        sx={{
          borderColor: category.color ?? 'secondary.main',
          color: category.color ?? 'text.primary',
          '&:hover': {
            borderColor: category.color ?? 'secondary.main',
            bgcolor: `${category.color}10`,
          },
          fontWeight: 500,
          margin: 0.5,
        }}
      />
    </Link>
  );
}
