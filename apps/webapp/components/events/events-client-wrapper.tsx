"use client";

import { useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { EventPreview } from '@/data/graphql/query/Event/types';
import { EventCategory, EventStatus } from '@/data/graphql/types/graphql';
import { EventFilterProvider } from '@/components/events/filters/event-filter-context';
import CustomContainer from '@/components/custom-container';
import { useFilteredEvents } from '@/hooks/useFilteredEvents';
import { useNetworkActivity } from '@/hooks/useNetworkActivity';
import { useEventFilters } from '@/hooks/useEventFilters';
import EventsHeader from '@/components/events/filters/events-header';
import FilterButtons from '@/components/events/filters/filter-buttons';
import ActiveFiltersPills from '@/components/events/filters/active-filters-pills';
import { CategoryMenu, StatusMenu, DateMenu } from '@/components/events/filters/filter-menus';
import EventsList from '@/components/events/filters/events-list';

interface EventsContentProps {
  categories: EventCategory[];
  initialEvents: EventPreview[];
}

interface EventsClientWrapperProps {
  events: EventPreview[];
  categories: EventCategory[];
}

function EventsContent({ categories, initialEvents }: EventsContentProps) {
  const { filters, setSearchQuery, resetFilters, hasActiveFilters, removeCategory, removeStatus, setCategories, setStatuses } = useEventFilters();
  const { events: serverEvents, loading, error } = useFilteredEvents(filters, initialEvents);
  const networkRequests = useNetworkActivity();

  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);

  const showSkeletons = loading || networkRequests > 0;

  const filteredEvents = useMemo(() => {
    const query = filters.searchQuery.trim().toLowerCase();
    if (!query) {
      return serverEvents;
    }
    return serverEvents.filter(
      event =>
        event.title?.toLowerCase().includes(query) ||
        event.summary?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query),
    );
  }, [serverEvents, filters.searchQuery]);

  const handleCategoryToggle = (categoryName: string) => {
    const newCategories = filters.categories.includes(categoryName)
      ? filters.categories.filter(c => c !== categoryName)
      : [...filters.categories, categoryName];
    setCategories(newCategories);
  };

  const handleStatusToggle = (status: EventStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    setStatuses(newStatuses);
  };

  const handleDateSelect = (option: string) => {
    // Handle date range selection
    setDateAnchor(null);
  };

  const statuses = [
    EventStatus.Upcoming,
    EventStatus.Ongoing,
    EventStatus.Completed,
    EventStatus.Cancelled,
  ];
  const dateOptions = ['Today', 'Tomorrow', 'This Week', 'This Weekend', 'This Month', 'Custom'];

  const eventTitles = filteredEvents.map(item => item.title).filter((title): title is string => !!title);

  return (
    <Box component="main" sx={{ minHeight: '100vh', py: 4 }}>
      <CustomContainer maxWidthOverrides={{ lg: '95%' }}>
        <EventsHeader 
          eventCount={filteredEvents.length}
          eventTitles={eventTitles}
          onSearch={setSearchQuery}
        />

        <FilterButtons
          categoryCount={filters.categories.length}
          statusCount={filters.statuses.length}
          hasActiveFilters={hasActiveFilters}
          onCategoryClick={(e) => setCategoryAnchor(e.currentTarget)}
          onStatusClick={(e) => setStatusAnchor(e.currentTarget)}
          onDateClick={(e) => setDateAnchor(e.currentTarget)}
          onClearAll={resetFilters}
        />

        {hasActiveFilters && (
          <ActiveFiltersPills
            categories={filters.categories}
            statuses={filters.statuses}
            onRemoveCategory={removeCategory}
            onRemoveStatus={removeStatus}
          />
        )}

        <CategoryMenu
          anchorEl={categoryAnchor}
          categories={categories}
          selectedCategories={filters.categories}
          onClose={() => setCategoryAnchor(null)}
          onToggle={handleCategoryToggle}
        />

        <StatusMenu
          anchorEl={statusAnchor}
          statuses={statuses}
          selectedStatuses={filters.statuses}
          onClose={() => setStatusAnchor(null)}
          onToggle={handleStatusToggle}
        />

        <DateMenu
          anchorEl={dateAnchor}
          dateOptions={dateOptions}
          onClose={() => setDateAnchor(null)}
          onSelect={handleDateSelect}
        />

        <EventsList
          events={filteredEvents}
          loading={showSkeletons}
          error={error}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={resetFilters}
        />
      </CustomContainer>
    </Box>
  );
}

export default function EventsClientWrapper({ events, categories }: EventsClientWrapperProps) {
  return (
    <EventFilterProvider>
      <EventsContent categories={categories} initialEvents={events} />
    </EventFilterProvider>
  );
}
