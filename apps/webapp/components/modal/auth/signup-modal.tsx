'use client';

import Link from 'next/link';
import Logo from '@/components/logo';
import { ReactElement, useState } from 'react';
import { Button, Typography, styled } from '@mui/material';
import CustomModal from '@/components/modal/custom-modal';
import CustomModalContent from '@/components/modal/custom-modal-content-wrapper';
import { Facebook, Google, Email } from '@mui/icons-material';
import SignupWithEmailModal from '@/components/modal/auth/signup-modal-form-modal';
import { useCustomAppContext } from '@/components/app-context';
import CustomModalCloseButton from '@/components/modal/custom-modal-close-button';

export type SignupModalProps = {
  triggerButton: ReactElement;
};

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.mode == 'dark' ? theme.palette.background.default : theme.palette.background.default,
  color: theme.palette.mode == 'dark' ? theme.palette.text.primary : theme.palette.text.secondary,
  borderColor: theme.palette.mode == 'dark' ? theme.palette.background.default : theme.palette.text.secondary,
}));

const SignupModal = ({ triggerButton }: SignupModalProps) => {
  const { setIsAuthN } = useCustomAppContext();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <CustomModal
      triggerButton={triggerButton}
      isOpen={open}
      handleClose={handleClose}
      handleOpen={handleOpen}
      modalContent={
        <CustomModalContent>
          <CustomModalCloseButton handleClose={handleClose} />

          <Logo />
          <Typography textAlign="center" variant="h4" fontWeight="bold" sx={{ marginBottom: 2 }}>
            Sign Up
          </Typography>
          <Typography variant="body1" textAlign="center" paddingBottom={3}>
            Already a member?
            <Link href={'/#'}>{' Log in here'}</Link>
          </Typography>
          <StyledButton variant="outlined" color="primary" startIcon={<Facebook />} size="large">
            Continue with Facebook
          </StyledButton>

          <StyledButton variant="outlined" color="secondary" startIcon={<Google />} size="large" sx={{ paddingX: 10 }}>
            Continue with Google
          </StyledButton>

          <SignupWithEmailModal
            triggerButton={
              <StyledButton variant="outlined" color="secondary" startIcon={<Email />} size="large">
                Sign up with Email
              </StyledButton>
            }
            setIsAuthN={setIsAuthN}
          />
        </CustomModalContent>
      }
    />
  );
};

export default SignupModal;
