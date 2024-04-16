import { styled } from '@mui/system';

const CustomBackdrop = styled('div')({
  zIndex: -1,
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgb(0 0 0 / 0.5)',
  WebkitTapHighlightColor: 'transparent',
});

export default CustomBackdrop;
