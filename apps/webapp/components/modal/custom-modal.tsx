import { JSXElementConstructor, ReactElement, cloneElement, useState } from 'react';
import { Modal } from '@mui/base/Modal';
import CustomBackdrop from '@/components/modal/custom-backdrop';
import { styled } from '@mui/material';

export type CustomModalProps = {
  triggerButton: ReactElement;
  modalContent: ReactElement<any, string | JSXElementConstructor<any>>;
};

const StyledModal = styled(Modal)({
  position: 'fixed',
  zIndex: 1300,
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const CustomModal = ({ triggerButton, modalContent }: CustomModalProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {cloneElement(triggerButton, { onClick: handleOpen })}
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: CustomBackdrop }}
      >
        {modalContent}
      </StyledModal>
    </div>
  );
};

export default CustomModal;
