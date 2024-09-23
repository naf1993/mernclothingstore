import React from 'react'
import {Modal,Box,Button} from '@mui/material'

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1300,
};

const modalStyle = {
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  outline: 'none',
  width: '90%', // Responsive width
  maxWidth: 600, // Max width
};
const Modal = ({children,handleClose,open}) => {
  return (
   <Modal open={open} onClose={handleClose}>
      <div style={overlayStyle}>
        <Box sx={modalStyle}>
          {title && <h2 id="modal-title">{title}</h2>}
          {children}
          <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </div>
   </Modal>
  )
}

export default Modal
