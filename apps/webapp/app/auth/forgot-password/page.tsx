import { Box, Container, Paper, Typography } from '@mui/material';
import Logo from '@/components/logo';
import ForgotPasswordForm from '@/components/forms/auth/forgot-password';

export default function ForgotPasswordPage() {
  return (
    <Box sx={{ py: 6, minHeight: '100vh', backgroundColor: 'background.paper' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Logo />

          <Typography textAlign="center" component="h1" variant="h5" marginTop={2}>
            Forgot Password
          </Typography>

          <ForgotPasswordForm />
        </Paper>
      </Container>
    </Box>
  );
}
