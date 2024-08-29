'use client'

import React, { useState } from 'react';
import { Box, Typography, Slider, Paper } from '@mui/material';

export default function PriceFilter() {
  const [priceRange, setPriceRange] = useState([0, 100]);

  const handlePriceChange = (event: any, newValue: any) => {
    setPriceRange(newValue);
    // onFilterChange({ priceRange: newValue });
  };

  return (
    <Paper sx={{ backgroundColor: 'background.default', p: 2 }}>
      <Box mb={2}>
        <Typography variant="body1" gutterBottom>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={100}
        />
      </Box>
    </Paper>
  );
};
