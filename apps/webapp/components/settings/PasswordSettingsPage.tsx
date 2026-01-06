'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import { Visibility, VisibilityOff, Security as SecurityIcon } from '@mui/icons-material';
import { updateUserPasswordAction } from '@/data/actions/server/user/update-user-password';

interface PasswordSettings {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: 'error' | 'warning' | 'info' | 'success';
}

import type { ActionState } from '@/data/actions/types';

export default function PasswordSettingsPage() {
  const [settings, setSettings] = useState<PasswordSettings>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [actionState, setActionState] = useState<ActionState>({});

  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: 'error',
  });

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, feedback: [], color: 'error' };
    }

    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 25;
    else feedback.push('Use at least 8 characters');

    if (password.length >= 12) score += 10;

    if (/[a-z]/.test(password)) score += 15;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 15;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 15;
    else feedback.push('Include numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score += 20;
    else feedback.push('Include special characters');

    const commonPatterns = [/123/i, /abc/i, /password/i, /qwerty/i, /admin/i, /(\w)\1{2,}/i];

    const hasCommonPattern = commonPatterns.some(pattern => pattern.test(password));
    if (!hasCommonPattern) score += 10;
    else feedback.push('Avoid common patterns');

    let color: 'error' | 'warning' | 'info' | 'success' = 'error';
    if (score >= 80) color = 'success';
    else if (score >= 60) color = 'info';
    else if (score >= 40) color = 'warning';

    return { score: Math.min(100, score), feedback, color };
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(settings.newPassword));
  }, [settings.newPassword]);

  useEffect(() => {
    if (actionState.success) {
      setSuccessMessage('Password changed successfully!');
      setPasswordError('');
      setSettings({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } else if (actionState.apiError) {
      setPasswordError(actionState.apiError);
      setSuccessMessage('');
    }
  }, [actionState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));

    setPasswordError('');
    setSuccessMessage('');
    setActionState({});
  };

  const validatePasswords = (): boolean => {
    if (!settings.currentPassword.trim()) {
      setPasswordError('Current password is required');
      return false;
    }

    if (!settings.newPassword.trim()) {
      setPasswordError('New password is required');
      return false;
    }

    if (settings.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return false;
    }

    if (settings.currentPassword === settings.newPassword) {
      setPasswordError('New password must be different from current password');
      return false;
    }

    if (!settings.confirmNewPassword.trim()) {
      setPasswordError('Please confirm your new password');
      return false;
    }

    if (settings.newPassword !== settings.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return false;
    }

    if (passwordStrength.score < 40) {
      setPasswordError('Password is too weak. Please follow the suggestions to strengthen it.');
      return false;
    }

    return true;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    setPasswordError('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('currentPassword', settings.currentPassword);
    formData.append('newPassword', settings.newPassword);

    startTransition(async () => {
      try {
        const result = await updateUserPasswordAction({}, formData);
        setActionState(result);
      } catch (error) {
        setActionState({
          apiError: 'An unexpected error occurred',
          success: false,
        });
      }
    });
  };

  const isFormValid =
    settings.currentPassword && settings.newPassword && settings.confirmNewPassword && passwordStrength.score >= 40;

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
          Password Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Update your password to keep your account secure
        </Typography>
      </Box>

      <form onSubmit={handleChangePassword}>
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
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'secondary.main',
                color: 'white',
              }}
            >
              <SecurityIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose a strong, unique password
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={settings.currentPassword}
                onChange={handleInputChange}
                variant="outlined"
                disabled={isPending}
                error={passwordError.includes('Current password') || !!actionState.zodErrors?.currentPassword}
                helperText={actionState.zodErrors?.currentPassword?.[0]}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                          disabled={isPending}
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                color="secondary"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={settings.newPassword}
                onChange={handleInputChange}
                variant="outlined"
                disabled={isPending}
                error={
                  passwordError.includes('New password') ||
                  passwordError.includes('Password is too weak') ||
                  !!actionState.zodErrors?.newPassword
                }
                helperText={actionState.zodErrors?.newPassword?.[0]}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          disabled={isPending}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                color="secondary"
              />

              {settings.newPassword && (
                <Box
                  sx={{
                    mt: 3,
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: `${passwordStrength.color}.main`,
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? `${passwordStrength.color}.dark` : `${passwordStrength.color}.lighter`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Password Strength
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color={`${passwordStrength.color}.main`}>
                      {passwordStrength.score >= 80 ? 'Strong' : passwordStrength.score >= 60 ? 'Good' : passwordStrength.score >= 40 ? 'Fair' : 'Weak'}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength.score}
                    color={passwordStrength.color}
                    sx={{ height: 10, borderRadius: 5, mb: 2 }}
                  />
                  {passwordStrength.feedback.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                        Suggestions to improve:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                        {passwordStrength.feedback.map((tip, index) => (
                          <Typography key={index} component="li" variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                            {tip}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmNewPassword"
                value={settings.confirmNewPassword}
                onChange={handleInputChange}
                variant="outlined"
                disabled={isPending}
                error={
                  passwordError.includes('do not match') ||
                  passwordError.includes('confirm') ||
                  !!actionState.zodErrors?.confirmNewPassword
                }
                helperText={actionState.zodErrors?.confirmNewPassword?.[0]}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={isPending}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                color="secondary"
              />
            </Grid>
          </Grid>

          {passwordError && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
              {passwordError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={!isFormValid || isPending}
              size="large"
              sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              {isPending ? 'Changing Password...' : 'Change Password'}
            </Button>
          </Stack>
        </Paper>

        {/* Security Tips */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid',
            borderColor: 'info.light',
            borderRadius: 3,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'info.dark' : 'info.lighter',
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom color="info.main" sx={{ mb: 3 }}>
            Password Security Tips
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 3, color: 'text.secondary' }}>
            <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
              <strong>Use at least 12 characters</strong> - Longer passwords are harder to crack
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
              <strong>Mix character types</strong> - Combine uppercase, lowercase, numbers, and symbols
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
              <strong>Avoid common patterns</strong> - Don't use sequences like "123" or "abc"
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
              <strong>Don't reuse passwords</strong> - Use a unique password for each account
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Consider a password manager</strong> - They can generate and store strong passwords
            </Typography>
          </Box>
        </Paper>
      </form>
    </Box>
  );
}
