'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Alert,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import { User } from '@/data/graphql/types/graphql';

interface EventSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  eventRecommendations: boolean;
  maxDistanceForEvents: number;
  preferredEvents: string[]; // Store category IDs
  eventFrequency: 'daily' | 'weekly' | 'monthly';
}

export default function EventSettingsPage({ user }: { user: User }) {
  const initialPreferredEvents = user.interests ? user.interests.map(interest => interest.eventCategoryId) : [];

  const [settings, setSettings] = useState<EventSettings>({
    emailNotifications: true,
    pushNotifications: false,
    eventRecommendations: true,
    maxDistanceForEvents: 50, // KM
    preferredEvents: initialPreferredEvents,
    eventFrequency: 'weekly',
  });

  const handleToggleChange = (name: keyof EventSettings) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSettings(prev => ({
      ...prev,
      maxDistanceForEvents: newValue as number,
    }));
  };

  const handleEventToggle = (categoryId: string) => {
    setSettings(prev => ({
      ...prev,
      preferredEvents: prev.preferredEvents.includes(categoryId)
        ? prev.preferredEvents.filter(id => id !== categoryId)
        : [...prev.preferredEvents, categoryId],
    }));
  };

  const handleSave = () => {
    // TODO: Implement actual save logic (API call, etc.)
    console.log('Event settings saved:', settings);
  };

  // Check if user has interests
  const hasInterests = user.interests && user.interests.length > 0;

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
          Event Preferences
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Customize how you discover and receive notifications about events
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Notification Preferences */}
        <Grid size={{ xs: 12 }}>
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
              Notification Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose how you want to receive event updates
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Stack spacing={2.5}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={() => handleToggleChange('emailNotifications')}
                      color="secondary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Email Notifications
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Receive event updates and recommendations via email
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={() => handleToggleChange('pushNotifications')}
                      color="secondary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Push Notifications
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Get instant notifications on your device
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.eventRecommendations}
                      onChange={() => handleToggleChange('eventRecommendations')}
                      color="secondary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Event Recommendations
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Receive personalized event suggestions based on your interests
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Event Discovery */}
        <Grid size={{ xs: 12 }}>
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
              Event Discovery
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Control how far you're willing to travel for events
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Box sx={{ px: 2 }}>
              <Typography variant="body1" fontWeight={600} gutterBottom>
                Maximum Distance: <Typography component="span" color="secondary.main">{settings.maxDistanceForEvents} miles</Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                We'll only show you events within this radius
              </Typography>
              <Slider
                value={settings.maxDistanceForEvents}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                step={5}
                marks={[
                  { value: 5, label: '5mi' },
                  { value: 25, label: '25mi' },
                  { value: 50, label: '50mi' },
                  { value: 75, label: '75mi' },
                  { value: 100, label: '100mi' },
                ]}
                min={5}
                max={100}
                color="secondary"
                sx={{ mt: 2 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Notification Frequency */}
        <Grid size={{ xs: 12 }}>
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
              Notification Frequency
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              How often would you like to receive event notifications?
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <FormControl fullWidth variant="outlined">
              <InputLabel color="secondary">Frequency</InputLabel>
              <Select
                value={settings.eventFrequency}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    eventFrequency: e.target.value as 'daily' | 'weekly' | 'monthly',
                  }))
                }
                label="Frequency"
                color="secondary"
              >
                <MenuItem value="daily">Daily - Get notified every day</MenuItem>
                <MenuItem value="weekly">Weekly - Receive a weekly digest</MenuItem>
                <MenuItem value="monthly">Monthly - Get a monthly summary</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Preferred Event Types */}
        <Grid size={{ xs: 12 }}>
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
              Preferred Event Types
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enable notifications for specific event categories
            </Typography>
            <Divider sx={{ mb: 4 }} />

            {!hasInterests ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  px: 2,
                  borderRadius: 2,
                  border: '2px dashed',
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                }}
              >
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  You haven't selected any interests yet.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visit the Interests page to customize your event preferences.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {user.interests?.map(category => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.eventCategoryId}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'secondary.main',
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.preferredEvents.includes(category.eventCategoryId)}
                            onChange={() => handleEventToggle(category.eventCategoryId)}
                            color="secondary"
                          />
                        }
                        label={<Typography variant="body2" fontWeight={500}>{category.name}</Typography>}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Info Alert */}
        <Grid size={{ xs: 12 }}>
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'info.light',
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              These settings help us personalize your event recommendations and notification preferences to match your interests.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleSave}
          size="large"
          sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}
