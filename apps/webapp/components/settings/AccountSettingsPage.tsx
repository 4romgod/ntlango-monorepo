'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface AccountSettings {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function AccountSettingsPage() {
  const [settings, setSettings] = useState<AccountSettings>({
    username: 'johndoe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteAccount = () => {
    // TODO: Implement actual account deletion logic (API call, etc.)
    console.log('Deleting account');
    setOpenDeleteAccountDialog(false);
  };

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'pt', label: 'Portuguese' }
  ];

  const timeZones = [
    { value: 'America/New_York', label: 'Eastern Time (New York)' },
    { value: 'America/Chicago', label: 'Central Time (Chicago)' },
    { value: 'America/Denver', label: 'Mountain Time (Denver)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (Los Angeles)' },
    { value: 'America/Anchorage', label: 'Alaska Time (Anchorage)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (Honolulu)' }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" fontWeight='bold' sx={{ mb: 5 }}>
        Account Management
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={settings.username}
            onChange={handleInputChange}
            variant="outlined"
            slotProps={{
              input: {
                readOnly: true,
              }
            }}
            color='secondary'
            sx={{
              pb: 4,
            }}
            disabled
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={settings.email}
            onChange={handleInputChange}
            variant="outlined"
            color='secondary'
            sx={{
              pb: 4,
            }}
          />

          <FormControl
            fullWidth
            variant="outlined"
            sx={{
              pb: 4,
            }}
          >
            <InputLabel
              color='secondary'
            >
              Language
            </InputLabel>
            <Select
              name="language"
              // TODO value={settings.language}
              onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              label="Language"
              color="secondary"
            >
              {languages.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel
              color='secondary'
            >
              Time Zone
            </InputLabel>
            <Select
              name="timeZone"
              // TODO value={settings.timeZone}
              onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
              label="Time Zone"
              color="secondary"
            >
              {timeZones.map((zone) => (
                <MenuItem
                  key={zone.value}
                  value={zone.value}
                >
                  {zone.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete Account
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Permanently remove your account and all associated data
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setOpenDeleteAccountDialog(true)}
          >
            Delete Account
          </Button>
        </Grid>
      </Grid>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={openDeleteAccountDialog}
        onClose={() => setOpenDeleteAccountDialog(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to permanently delete your account?
            This action cannot be undone and will remove all your data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAccountDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="primary"
            variant="contained"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
