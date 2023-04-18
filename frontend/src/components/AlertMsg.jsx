import React from 'react';
import Alert from '@mui/material/Alert';

const AlertMsg = ({ message, successor }) => {
  const handleClose = () => {
    const alert = document.querySelector('#alert');
    if (alert) {
      alert.remove();
    }
  }

  return (
    <>
      <Alert
        id='alert'
        severity='error'
        onClose={successor || handleClose}
        sx={{ zIndex: 999, position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)' }}
      >
        {message}
      </Alert>
    </>
  );
}

export default AlertMsg;
