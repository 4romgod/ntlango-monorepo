import { Typography } from '@mui/material';
import CustomModal from '../modal/custom-modal';
import CustomModalContent from '../modal/custom-modal-content';
import CustomModalButton from '../modal/custom-modal-button';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import { ReactElement } from 'react';
import Logo from '../logo';
import Link from 'next/link';

export type SignupModalProps = {
  triggerButton: ReactElement;
};

const SignupModal = (props: SignupModalProps) => {
  return (
    <CustomModal
      triggerButton={props.triggerButton}
      modalContent={
        <CustomModalContent>
          <Logo />
          <Typography
            textAlign="center"
            variant="h4"
            fontWeight="bold"
            sx={{ marginBottom: 2 }}
          >
            Sign Up
          </Typography>
          <Typography variant="body1" textAlign="center" paddingBottom={3}>
            Already a member?
            <Link href={'/#'}>{' Log in here'}</Link>
          </Typography>
          <CustomModalButton
            variant="outlined"
            color="primary"
            startIcon={<FacebookIcon />}
            size="large"
          >
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
          <CustomModalButton
            variant="outlined"
            color="primary"
            startIcon={<EmailIcon />}
            size="large"
          >
            Sign up with Email
          </CustomModalButton>
        </CustomModalContent>
      }
    />
  );
};

export default SignupModal;
