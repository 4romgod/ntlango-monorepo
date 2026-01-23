'use client';

import React from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function ToastProvider() {
  const { toastProps, setToastProps } = useAppContext();
  const { open, anchorOrigin, autoHideDuration, severity, message } = toastProps;

  const handleClose = () => {
    setToastProps({ ...toastProps, open: false });
  };

  return (
    <Snackbar open={open} onClose={handleClose} autoHideDuration={autoHideDuration} anchorOrigin={anchorOrigin}>
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
