'use client'

import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Chip, Paper, Typography } from '@mui/material';
import { EventCategoryType } from '@/data/graphql/types/graphql';
import { getEventCategoryIcon } from '@/lib/constants';

export default function CategoryFilter({ categoryList }: { categoryList: EventCategoryType[] }) {
  const [categories, setCategories] = useState([]);

  const handleCategoryChange = (event: any) => {
    const selectedCategories = event.target.value;
    setCategories(selectedCategories);
    // onFilterChange({ categories: selectedCategories });
  };

  return (
    <Paper sx={{ backgroundColor: 'background.default', p: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="category-label">Categories</InputLabel>
        <Select
          labelId="category-label"
          multiple
          value={categories}
          onChange={handleCategoryChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {categoryList.map((category) => {
            const IconComponent = getEventCategoryIcon(category.iconName);
            return (
              <MenuItem key={category.eventCategoryId} value={category.name}>
                <Box
                  component="div"
                  sx={{
                    display: 'flex',
                    px: 2,
                  }}
                >
                  <IconComponent
                    color={category.color || ''}
                    height={24}
                    width={24}
                  />
                  <Typography variant='body1' pl={1}>{category.name}</Typography>
                </Box>
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </Paper>
  );
};
