'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  IconButton,
  CircularProgress,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import { Edit as EditIcon, CameraAlt as CameraIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { Address, UpdateUserInput, User } from '@/data/graphql/types/graphql';
import { useActionState } from 'react';
import { updateUserProfileAction } from '@/data/actions/server/user/update-user-profile';
import { useAppContext } from '@/hooks/useAppContext';
import { FormErrors } from '@/components/form-errors';
import AddressForm from '@/components/forms/input-address';

export default function EditProfilePage({ user }: { user: User }) {
  const [isEditing, setIsEditing] = useState(false);
  const { setToastProps, toastProps } = useAppContext();
  const [formState, formAction] = useActionState(updateUserProfileAction, {});
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<UpdateUserInput>({
    userId: user.userId,
    given_name: user.given_name,
    family_name: user.family_name,
    profile_picture: user.profile_picture,
    bio: user.bio,
    phone_number: user.phone_number,
    birthdate: user.birthdate,
    username: user.username,
    address: user.address,
  });

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
        message: 'Profile updated successfully!',
      });
      setIsEditing(false);
    }
  }, [formState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (address: Address) => {
    setProfile(prev => ({
      ...prev,
      address: address,
    }));
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: 'text.primary' }}>
            Edit Profile
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Update your profile information and how others see you
          </Typography>
        </Box>

        {!isEditing && (
          <Button
            startIcon={<EditIcon />}
            onClick={() => setIsEditing(true)}
            variant="contained"
            color="secondary"
            size="large"
            sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Edit Profile
          </Button>
        )}
      </Stack>

      <Box component="form" action={formAction} noValidate>
        {/* Profile Picture Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'action.hover',
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Profile Picture
          </Typography>

          <Stack direction="row" spacing={4} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={profile.profile_picture || ''}
                alt={`${profile.given_name} ${profile.family_name}`}
                sx={(theme) => ({
                  width: 140,
                  height: 140,
                  border: '5px solid',
                  borderColor: 'background.paper',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                })}
              />
              {isEditing && (
                <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>
                  <input accept="image/*" style={{ display: 'none' }} id="profile-picture-upload" type="file" />
                  <label htmlFor="profile-picture-upload">
                    <IconButton
                      component="span"
                      sx={{
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        width: 48,
                        height: 48,
                        '&:hover': {
                          bgcolor: 'secondary.dark',
                          transform: 'scale(1.05)',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <CameraIcon fontSize="medium" />
                    </IconButton>
                  </label>
                </Box>
              )}
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={500} gutterBottom>
                {isEditing ? 'Upload a new photo' : 'Your profile photo'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {isEditing ? 'Click the camera icon to change your profile picture.' : 'This is how others will see you on Ntlango.'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                • Recommended size: 400x400px<br />
                • Maximum file size: 5MB<br />
                • Supported formats: JPG, PNG, GIF
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Contact Information */}
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
            Contact Information
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your personal details and contact information
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="First Name"
                name="given_name"
                value={profile.given_name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                color="secondary"
              />
              <FormErrors error={formState?.zodErrors?.given_name} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                name="family_name"
                value={profile.family_name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                color="secondary"
              />
              <FormErrors error={formState?.zodErrors?.family_name} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={profile.username || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                color="secondary"
              />
              <FormErrors error={formState?.zodErrors?.username} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={profile.phone_number || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                color="secondary"
              />
              <FormErrors error={formState?.zodErrors?.phone_number} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="birthdate"
                type="date"
                value={profile.birthdate || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="outlined"
                color="secondary"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <FormErrors error={formState?.zodErrors?.birthdate} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={profile.bio || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                multiline
                rows={4}
                variant="outlined"
                color="secondary"
                placeholder="Tell others about yourself..."
              />
              <FormErrors error={formState?.zodErrors?.bio} />
            </Grid>
          </Grid>
        </Paper>

        {/* Address Information */}
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
            Home Address
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We'll use this to show you nearby events
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <AddressForm value={profile.address} onChange={handleAddressChange} disabled={!isEditing} name="address" />
        </Paper>

        {/* Action Buttons */}
        {isEditing && (
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
            <Button
              startIcon={<CancelIcon />}
              onClick={() => setIsEditing(false)}
              disabled={loading}
              variant="outlined"
              size="large"
              sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              variant="contained"
              color="secondary"
              type="submit"
              disabled={loading}
              size="large"
              sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
