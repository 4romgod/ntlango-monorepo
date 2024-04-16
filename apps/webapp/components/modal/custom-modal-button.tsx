import { styled } from '@mui/material';
import { Button, ButtonProps } from '@mui/material';

export type CustomModalButtonProps = ButtonProps & {
  children: React.ReactNode;
};

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}));

export default function CustomModalButton({
  children,
  ...props
}: CustomModalButtonProps) {
  return <StyledButton {...props}>{children}</StyledButton>;
}
