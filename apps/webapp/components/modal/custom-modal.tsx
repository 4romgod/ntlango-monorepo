import { ReactElement, cloneElement } from 'react';
import { Box, styled } from '@mui/material';
import CustomBackdrop from '@/components/modal/custom-backdrop';
import { Dialog } from '@mui/material';

export type CustomModalProps = {
  triggerButton: ReactElement;
  modalContent: ReactElement;
  handleClose: () => void;
  handleOpen: () => void;
  isOpen: boolean;
};

const StyledModal = styled(Dialog)({
  position: 'fixed',
  zIndex: 1300,
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const CustomModal = ({ triggerButton, modalContent, isOpen, handleClose, handleOpen }: CustomModalProps) => {
  return (
    <Box component="div">
      {cloneElement(triggerButton, { onClick: () => handleOpen() })}
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={isOpen}
        onClose={handleClose}
        slots={{ backdrop: CustomBackdrop }}
      >
        <Box component="div">{modalContent}</Box>
      </StyledModal>
    </Box>
  );
};

export default CustomModal;
