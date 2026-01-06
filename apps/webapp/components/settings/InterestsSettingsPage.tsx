'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { EventCategoryGroup, EventCategory, User } from '@/data/graphql/types/graphql';

export default function InterestsSettingsPage({
  user,
  eventCategoryGroups,
}: {
  user: User;
  eventCategoryGroups: EventCategoryGroup[];
}) {
  const [selectedInterests, setSelectedInterests] = useState<EventCategory[]>(user.interests ? user.interests : []);
  const [tempInterests, setTempInterests] = useState<EventCategory[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInterestToggle = (eventCategory: EventCategory) => {
    setTempInterests(prev => {
      const exists = prev.some(item => item.eventCategoryId === eventCategory.eventCategoryId);
      if (exists) {
        return prev.filter(item => item.eventCategoryId !== eventCategory.eventCategoryId);
      } else {
        return [...prev, eventCategory];
      }
    });
  };

  const handleSaveInterests = () => {
    setSelectedInterests(tempInterests);
    setOpenModal(false);
    // TODO: Implement actual save logic (API call, etc.)
    console.log('Selected Interests:', tempInterests);
  };

  const handleRemoveInterest = (interestId: string) => {
    setSelectedInterests(prev => prev.filter(item => item.eventCategoryId !== interestId));
  };

  // Filter event categories based on search term
  const filteredCategoryGroups = eventCategoryGroups
    .map(group => {
      const filteredCategories = group.eventCategories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      return { ...group, eventCategories: filteredCategories };
    })
    .filter(group => group.eventCategories.length > 0);

  return (
    <Box>
      <Stack spacing={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
              My Interests
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Select interests to get personalized event recommendations
            </Typography>
          </Box>

          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="secondary"
            onClick={() => {
              setTempInterests([...selectedInterests]);
              setSearchTerm('');
              setOpenModal(true);
            }}
            size="large"
            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            Edit Interests
          </Button>
        </Stack>

        {/* Selected Interests Display */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
            Your Interests
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({selectedInterests.length} selected)
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            These help us personalize your event recommendations
          </Typography>
          <Divider sx={{ mb: 4 }} />

          {selectedInterests.length === 0 ? (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8,
                px: 2,
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: 'background.default',
              }}
            >
              <AddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                No interests selected yet
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Click "Edit Interests" to get started and receive personalized recommendations!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {selectedInterests.map(interest => (
                <Chip
                  key={interest.eventCategoryId}
                  label={interest.name}
                  onDelete={() => handleRemoveInterest(interest.eventCategoryId)}
                  color="secondary"
                  variant="filled"
                  sx={{ 
                    borderRadius: 2, 
                    py: 2.5,
                    px: 0.5,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>
      </Stack>

      {/* Interest Selection Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Select Your Interests
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Choose categories you're interested in
              </Typography>
            </Box>
            <Button 
              size="small" 
              onClick={() => setOpenModal(false)} 
              sx={{ minWidth: 'auto', color: 'text.secondary' }}
            >
              <CloseIcon />
            </Button>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {/* Search Bar */}
          <Box sx={{ mb: 3, mt: 1 }}>
            <TextField
              fullWidth
              placeholder="Search interests..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 2 }}
            />
          </Box>

          {/* Selected Count & Chips */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(103, 58, 183, 0.1) 100%)',
              border: '1px solid',
              borderColor: 'secondary.light',
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="secondary.main">
              {tempInterests.length} {tempInterests.length === 1 ? 'interest' : 'interests'} selected
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {tempInterests.length > 0 ? (
                tempInterests.map(interest => (
                  <Chip
                    key={interest.eventCategoryId}
                    label={interest.name}
                    onDelete={() => handleInterestToggle(interest)}
                    size="small"
                    sx={{
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      borderRadius: 1.5,
                      fontWeight: 500,
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No interests selected yet. Start by checking some categories below.
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Category Groups */}
          <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
            {filteredCategoryGroups.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="body1" color="text.secondary">
                  No interests found matching "{searchTerm}"
                </Typography>
              </Box>
            ) : (
              filteredCategoryGroups.map(categoryGroup => (
                <Box key={categoryGroup.eventCategoryGroupId} sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
                    {categoryGroup.name}
                  </Typography>
                  <Grid container spacing={1.5}>
                    {categoryGroup.eventCategories.map(category => (
                      <Grid size={{ xs: 12, sm: 6 }} key={category.eventCategoryId}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            border: '2px solid',
                            borderColor: tempInterests.some(item => item.eventCategoryId === category.eventCategoryId)
                              ? 'secondary.main'
                              : 'divider',
                            borderRadius: 2,
                            bgcolor: tempInterests.some(item => item.eventCategoryId === category.eventCategoryId)
                              ? 'secondary.lighter'
                              : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: 'secondary.main',
                              bgcolor: 'action.hover',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            },
                          }}
                          onClick={() => handleInterestToggle(category)}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={tempInterests.some(item => item.eventCategoryId === category.eventCategoryId)}
                                onChange={() => handleInterestToggle(category)}
                                color="secondary"
                              />
                            }
                            label={<Typography variant="body2" fontWeight={500}>{category.name}</Typography>}
                            sx={{ m: 0, width: '100%', userSelect: 'none' }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          <Button 
            onClick={() => setOpenModal(false)} 
            variant="outlined" 
            size="large"
            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            startIcon={<SaveIcon />}
            onClick={handleSaveInterests}
            color="secondary"
            variant="contained"
            size="large"
            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            Save {tempInterests.length} {tempInterests.length === 1 ? 'Interest' : 'Interests'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
