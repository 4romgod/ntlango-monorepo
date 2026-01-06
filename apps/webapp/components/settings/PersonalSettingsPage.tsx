'use client';

import React, { useActionState, useEffect, useState } from 'react';
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
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Save as SaveIcon } from '@mui/icons-material';
import { Gender, User } from '@/data/graphql/types/graphql';
import { updateUserProfileAction } from '@/data/actions/server/user/update-user-profile';
import { useAppContext } from '@/hooks/useAppContext';
import dayjs from 'dayjs';

interface PersonalSettings {
  privateProfile: boolean;
  showEmail: boolean;
  showPhoneNumber: boolean;
  birthdate: string;
  gender: Gender | null;
}

export default function PersonalSettingsPage({ user }: { user: User }) {
  const { setToastProps, toastProps } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formState, formAction] = useActionState(updateUserProfileAction, {});
  const [settings, setSettings] = useState<PersonalSettings>({
    privateProfile: false,
    showEmail: true,
    showPhoneNumber: false,
    birthdate: user.birthdate,
    gender: user.gender || null,
  });

  const handleToggleChange = (name: keyof PersonalSettings) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setLoading(false);

    if (formState.apiError) {
      setToastProps({
        ...toastProps,
        open: true,
        severity: 'error',
        message: formState.apiError,
      });
    }

    if (formState.data) {
      setToastProps({
        ...toastProps,
        open: true,
        severity: 'success',
        message: 'Personal Settings updated successfully!',
      });
    }
  }, [formState]);

  return (
    <Box>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
            Personal Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your personal information and privacy preferences
          </Typography>
        </Box>

        <Box component="form" action={formAction} noValidate>
          {/* Personal Details */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
              Personal Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Basic information about yourself
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                    <DatePicker
                      label="Date of Birth"
                      format="YYYY-MM-DD"
                      name="birthdate"
                      value={dayjs(settings.birthdate)}
                      slotProps={{
                        textField: {
                          color: 'secondary',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel color="secondary">Gender</InputLabel>
                  <Select
                    name="gender"
                    value={settings.gender || ''}
                    onChange={e => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                    label="Gender"
                    color="secondary"
                  >
                    {Object.values(Gender).map(gender => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Privacy Settings */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
              Privacy Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Control who can see your information
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
                      checked={settings.privateProfile}
                      onChange={() => handleToggleChange('privateProfile')}
                      color="secondary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Private Profile
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Only you can see your profile information
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
                      checked={settings.showEmail}
                      onChange={() => handleToggleChange('showEmail')}
                      color="secondary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Show Email Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Allow other members to see your email
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
                      checked={settings.showPhoneNumber}
                      onChange={() => handleToggleChange('showPhoneNumber')}
                      color="secondary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        Show Phone Number
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Allow other members to see your phone
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Stack>
          </Paper>

          {/* Action Button */}
          <Stack direction="row" justifyContent="flex-end">
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              color="secondary"
              type="submit"
              size="large"
              sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
