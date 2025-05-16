'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Security as SecurityIcon
} from '@mui/icons-material';

interface PasswordSettings {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export default function PasswordSettingsPage() {
  const [settings, setSettings] = useState<PasswordSettings>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear password error when typing
    if (name.includes('Password')) {
      setPasswordError('');
    }
  };

  const handleChangePassword = () => {
    // Validate password change
    if (!settings.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (settings.newPassword !== settings.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (settings.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    // TODO: Implement actual password change logic (API call, etc.)
    console.log('Changing password');
    // Reset password fields after successful change
    setSettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }));
    setPasswordError('');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h4" fontWeight='bold' sx={{ mb: 5 }}>
        Password Management
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <SecurityIcon sx={{ mr: 1, color: 'text.secondary' }} />
            Change Password
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={settings.currentPassword}
                onChange={handleInputChange}
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                color='secondary'
                sx={{
                  pb: 4,
                }}
              />

              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={settings.newPassword}
                onChange={handleInputChange}
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                color='secondary'
                sx={{
                  pb: 4,
                }}
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmNewPassword"
                value={settings.confirmNewPassword}
                onChange={handleInputChange}
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                color='secondary'
              />
            </Grid>
          </Grid>

          {passwordError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {passwordError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
