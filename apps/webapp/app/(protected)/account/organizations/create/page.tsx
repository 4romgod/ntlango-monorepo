'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
} from '@mui/material';
import { ArrowBack, Save, CloudUpload, Close } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { CreateOrganizationDocument } from '@/data/graphql/query';
import { useSession } from 'next-auth/react';
import { getAuthHeader } from '@/lib/utils';

export default function CreateOrganizationPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token;
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    billingEmail: '',
    tags: '',
  });

  const [createOrganization, { loading }] = useMutation(CreateOrganizationDocument, {
    context: { headers: getAuthHeader(token) },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.userId) {
      setError('You must be logged in to create an organization');
      return;
    }

    if (!formData.name.trim()) {
      setError('Organization name is required');
      return;
    }

    try {
      setError(null);

      const result = await createOrganization({
        variables: {
          input: {
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            logo: formData.logo.trim() || null,
            billingEmail: formData.billingEmail.trim() || null,
            ownerId: session.user.userId,
            tags: formData.tags
              ? formData.tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
              : [],
          },
        },
      });

      const createdOrg = result.data?.createOrganization;
      if (createdOrg?.slug) {
        router.push(ROUTES.ACCOUNT.ORGANIZATIONS.SETTINGS(createdOrg.slug));
      } else {
        router.push(ROUTES.ACCOUNT.ORGANIZATIONS.ROOT);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create organization');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', py: 3 }}>
        <Container>
          <Button
            component={Link}
            href={ROUTES.ACCOUNT.ORGANIZATIONS.ROOT}
            startIcon={<ArrowBack />}
            sx={{ mb: 2, fontWeight: 600, textTransform: 'none' }}
          >
            Back to Organizations
          </Button>
          <Typography variant="h4" fontWeight={800}>
            Create New Organization
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Set up a new organization to host events as a team
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card
          elevation={0}
          sx={{ maxWidth: 800, mx: 'auto', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  id="org-name"
                  label="Organization Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  fullWidth
                  required
                  helperText="The name of your organization (e.g., 'Tech Meetup NYC', 'Startup Community')"
                  autoFocus
                />

                <TextField
                  id="org-description"
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={4}
                  fullWidth
                  helperText="Tell people what your organization is about"
                />

                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Organization Logo
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Button component="label" variant="outlined" startIcon={<CloudUpload />}>
                      {logoFile ? logoFile.name : 'Upload Image'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLogoFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setLogoPreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </Button>
                    {logoFile && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        sx={{ color: 'text.secondary' }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  {logoPreview && (
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        mt: 1,
                      }}
                    >
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Select an image from your device to preview how your logo will look. This image is only used locally
                    and is not uploaded automatically when you create the organization.
                  </Typography>
                </Box>

                <TextField
                  id="org-billing-email"
                  label="Billing Email"
                  type="email"
                  value={formData.billingEmail}
                  onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                  fullWidth
                  helperText="Email address for invoices and billing notifications"
                />

                <TextField
                  id="org-tags"
                  label="Tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  fullWidth
                  helperText="Comma-separated tags for discovery (e.g., music, tech, sports, networking)"
                />

                {formData.tags && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Preview:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {formData.tags
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <Chip key={tag} label={`#${tag}`} size="small" sx={{ fontWeight: 500 }} />
                        ))}
                    </Stack>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
                  <Button
                    component={Link}
                    href={ROUTES.ACCOUNT.ORGANIZATIONS.ROOT}
                    variant="outlined"
                    disabled={loading}
                    sx={{ fontWeight: 600, textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                    disabled={loading || !formData.name.trim()}
                    sx={{ fontWeight: 600, textTransform: 'none', px: 4 }}
                  >
                    {loading ? 'Creating...' : 'Create Organization'}
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
          <Alert severity="info">
            <Typography variant="body2" fontWeight={600} gutterBottom>
              What happens next?
            </Typography>
            <Typography variant="body2" component="div">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>You'll automatically become the owner of this organization</li>
                <li>You can invite team members and assign them roles</li>
                <li>Start creating events under your organization's name</li>
                <li>Customize your organization's public profile</li>
              </ul>
            </Typography>
          </Alert>
        </Box>
      </Container>
    </Box>
  );
}
