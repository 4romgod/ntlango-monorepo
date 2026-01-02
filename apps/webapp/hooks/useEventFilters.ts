import { useContext } from 'react';
import { EventFilterContext, EventFilterContextType } from '@/components/events/filters/event-filter-context';

export const useEventFilters = (): EventFilterContextType => {
  const context = useContext(EventFilterContext);
  if (!context) {
    throw new Error('useEventFilters must be used within an EventFilterProvider');
  }
  return context;
};
