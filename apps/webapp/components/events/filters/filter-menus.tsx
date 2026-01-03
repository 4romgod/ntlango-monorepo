"use client";

import { Menu, MenuItem, Checkbox, ListItemText, ListItemIcon } from '@mui/material';
import { EventCategory, EventStatus } from '@/data/graphql/types/graphql';
import { getEventCategoryIcon } from '@/lib/constants';

interface CategoryMenuProps {
  anchorEl: HTMLElement | null;
  categories: EventCategory[];
  selectedCategories: string[];
  onClose: () => void;
  onToggle: (categoryName: string) => void;
}

export function CategoryMenu({ anchorEl, categories, selectedCategories, onClose, onToggle }: CategoryMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{
        paper: {
          className: 'glass-card',
          sx: {
            mt: 1,
            minWidth: 280,
            maxHeight: 400,
          },
        },
      }}
    >
      {categories.map((category) => {
        const IconComponent = getEventCategoryIcon(category.iconName);
        const isSelected = selectedCategories.includes(category.name);
        return (
          <MenuItem 
            key={category.eventCategoryId} 
            onClick={() => onToggle(category.name)}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Checkbox 
              checked={isSelected} 
              size="small"
              color="primary"
            />
            <ListItemIcon sx={{ minWidth: 36 }}>
              <IconComponent color={category.color || ''} height={20} width={20} />
            </ListItemIcon>
            <ListItemText 
              primary={category.name}
              sx={{ color: 'inherit' }}
            />
          </MenuItem>
        );
      })}
    </Menu>
  );
}

interface StatusMenuProps {
  anchorEl: HTMLElement | null;
  statuses: EventStatus[];
  selectedStatuses: EventStatus[];
  onClose: () => void;
  onToggle: (status: EventStatus) => void;
}

export function StatusMenu({ anchorEl, statuses, selectedStatuses, onClose, onToggle }: StatusMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{
        paper: {
          className: 'glass-card',
          sx: {
            mt: 1,
            minWidth: 220,
          },
        },
      }}
    >
      {statuses.map((status) => {
        const isSelected = selectedStatuses.includes(status);
        return (
          <MenuItem 
            key={status} 
            onClick={() => onToggle(status)}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Checkbox 
              checked={isSelected} 
              size="small"
              color="secondary"
            />
            <ListItemText 
              primary={status}
              sx={{ color: 'inherit' }}
            />
          </MenuItem>
        );
      })}
    </Menu>
  );
}

interface DateMenuProps {
  anchorEl: HTMLElement | null;
  dateOptions: string[];
  onClose: () => void;
  onSelect: (option: string) => void;
}

export function DateMenu({ anchorEl, dateOptions, onClose, onSelect }: DateMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{
        paper: {
          className: 'glass-card',
          sx: {
            mt: 1,
            minWidth: 200,
          },
        },
      }}
    >
      {dateOptions.map((option) => (
        <MenuItem 
          key={option}
          onClick={() => onSelect(option)}
          sx={{
            '&:hover': {
              bgcolor: 'action.hover',
            },
            color: 'inherit',
          }}
        >
          {option}
        </MenuItem>
      ))}
    </Menu>
  );
}
