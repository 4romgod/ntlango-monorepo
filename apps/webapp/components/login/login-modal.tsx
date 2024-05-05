'use client';

import {
  Box,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import CustomModal from '../modal/custom-modal';
import CustomModalContent from '../modal/custom-modal-content';
import CustomModalButton from '../modal/custom-modal-button';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { Dispatch, ReactElement, SetStateAction } from 'react';
import Logo from '../logo';
import Link from 'next/link';

export type LoginModalProps = {
  triggerButton: ReactElement;
  setIsAuthN: Dispatch<SetStateAction<boolean>>;
};

const StyledTextField = styled(TextField)(({ theme }) => ({}));

const LoginModal = (props: LoginModalProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <CustomModal
      triggerButton={props.triggerButton}
      modalContent={
        <CustomModalContent>
          <Logo />
          <Typography textAlign="center" variant="h4" fontWeight="bold">
            Log in
          </Typography>
          <Link href="#" style={{ width: '100%', textAlign: 'center' }}>
            {"Don't have an account? Sign Up"}
          </Link>

          <Container maxWidth="xs">
            <Box
              sx={{
                marginTop: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  color="secondary"
                />
                <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                <Grid container paddingTop={3}>
                  <Grid item xs>
                    <Link href="#">Forgot password?</Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>

          <CustomModalButton
            variant="contained"
            color="primary"
            size="large"
            sx={{ paddingX: 10 }}
            onClick={() => props.setIsAuthN(true)}
          >
            Log in
          </CustomModalButton>

          <Divider>or</Divider>

          <CustomModalButton variant="outlined" color="primary" startIcon={<FacebookIcon />} size="large">
            Continue with Facebook
          </CustomModalButton>
          <CustomModalButton
            variant="outlined"
            color="primary"
            startIcon={<GoogleIcon />}
            size="large"
            sx={{ paddingX: 10 }}
          >
            Continue with Google
          </CustomModalButton>
          <CustomModalButton variant="outlined" color="primary" startIcon={<EmailIcon />} size="large">
            Sign up with Email
          </CustomModalButton>
        </CustomModalContent>
      }
    />
  );
};

export default LoginModal;
