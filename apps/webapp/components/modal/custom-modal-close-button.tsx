import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';

export default function CustomModalCloseButton({ handleClose }: { handleClose: () => void }) {
  return (
    <IconButton
      aria-label="close"
      onClick={handleClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
      }}
    >
      <Close />
    </IconButton>
  );
}
