import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const getDateDistanceToNow = (dateString: string) => {
  const date = parseISO(dateString);
  const distance = formatDistanceToNow(date, { addSuffix: true });
  return distance;
};

export const getFormattedDate = (dateString: string) => {
  const date = parseISO(dateString);
  const formatted = format(date, 'EEEE, MMMM d, yyyy · h:mma');
  return formatted;
};
