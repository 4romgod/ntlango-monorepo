"use client";

import { Button, Stack } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TuneIcon from '@mui/icons-material/Tune';
import ClearIcon from '@mui/icons-material/Clear';

interface FilterButtonsProps {
  categoryCount: number;
  statusCount: number;
  hasActiveFilters: boolean;
  onCategoryClick: (event: React.MouseEvent<HTMLElement>) => void;
  onStatusClick: (event: React.MouseEvent<HTMLElement>) => void;
  onDateClick: (event: React.MouseEvent<HTMLElement>) => void;
  onClearAll: () => void;
}

export default function FilterButtons({
  categoryCount,
  statusCount,
  hasActiveFilters,
  onCategoryClick,
  onStatusClick,
  onDateClick,
  onClearAll,
}: FilterButtonsProps) {
  return (
    <Stack 
      direction="row" 
      spacing={1.5} 
      sx={{ 
        flexWrap: 'wrap',
        gap: 1.5,
        mb: 2,
      }}
    >
      {/* Category Filter Button */}
      <Button
        variant="outlined"
        onClick={onCategoryClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<TuneIcon sx={{ fontSize: '1rem' }} />}
        className="glass-button"
        sx={{
          borderRadius: '50px',
          px: 3,
          py: 1.25,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          borderWidth: categoryCount > 0 ? 2 : 1,
          borderColor: categoryCount > 0 ? 'primary.main' : 'divider',
          bgcolor: categoryCount > 0 ? 'action.selected' : 'background.paper',
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'primary.main',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {categoryCount > 0 ? `Categories (${categoryCount})` : 'Categories'}
      </Button>

      {/* Status Filter Button */}
      <Button
        variant="outlined"
        onClick={onStatusClick}
        endIcon={<KeyboardArrowDownIcon />}
        className="glass-button"
        sx={{
          borderRadius: '50px',
          px: 3,
          py: 1.25,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          borderWidth: statusCount > 0 ? 2 : 1,
          borderColor: statusCount > 0 ? 'secondary.main' : 'divider',
          bgcolor: statusCount > 0 ? 'action.selected' : 'background.paper',
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'secondary.main',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {statusCount > 0 ? `Status (${statusCount})` : 'Status'}
      </Button>

      {/* Date Filter Button */}
      <Button
        variant="outlined"
        onClick={onDateClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<CalendarTodayIcon sx={{ fontSize: '1rem' }} />}
        className="glass-button"
        sx={{
          borderRadius: '50px',
          px: 3,
          py: 1.25,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          color: 'text.primary',
          '&:hover': {
            bgcolor: 'action.hover',
            borderColor: 'primary.light',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        Date
      </Button>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <Button
          variant="text"
          onClick={onClearAll}
          startIcon={<ClearIcon />}
          sx={{
            borderRadius: '50px',
            px: 3,
            py: 1.25,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'text.primary',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Clear all
        </Button>
      )}
    </Stack>
  );
}
