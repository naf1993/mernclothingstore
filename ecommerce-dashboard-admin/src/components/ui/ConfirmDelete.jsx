import { Button, Typography,CircularProgress } from '@mui/material'
import { Box,useTheme } from '@mui/material'
import React from 'react'

const ConfirmDelete = ({productname,onConfirm,disabled,onCloseModal,loading}) => {
    const theme = useTheme()
    const handleConfirm = () => {
      onConfirm().then(() => onCloseModal()); // Call onCloseModal after onConfirm completes
    };
  return (
<Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <Typography variant="h5">Delete {productname}</Typography>
      <Typography variant="body1">
        Are you sure you want to delete this {productname} permanently? This action cannot be undone.
      </Typography>
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.orange[100],
            color: 'white',
          }}
          onClick={handleConfirm}
          disabled={disabled || loading}
          aria-label={`Confirm deletion of ${productname}`}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Confirm"}
        </Button>
        <Button
          onClick={onCloseModal}
          sx={{
            backgroundColor: theme.palette.green[400],
            color: 'white',
          }}
          variant="outlined"
          aria-label={`Cancel deletion of ${productname}`}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  )
}

export default ConfirmDelete
