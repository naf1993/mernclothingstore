import React, { forwardRef } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';

const CustomSelect = forwardRef(({ label, options, error, value, onChange }, ref) => {
 

  return (
    <FormControl fullWidth variant="outlined" sx={{ marginBottom: '0.7rem' }} error={Boolean(error)}>
      <InputLabel>{label}</InputLabel>
      <Select  sx={{
          backgroundColor: "white", // Set background color to white
          "& .MuiSelect-select": {
            padding: "10px", // Optional: add padding for better appearance
          },
        }}
        ref={ref}
        value={value || ''}
        onChange={(e) => {
        
          onChange(e); // Ensure this is called
        }}
        label={label} 
        MenuProps={{
          PaperProps: {
            sx: {
              zIndex: 2002, // Set a higher z-index to ensure it's above the modal
            },
          },
        }}
      >
        <MenuItem value="">
          <em>Select...</em>
        </MenuItem>
        {options && options.length > 0 ? (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No options available</MenuItem>
        )}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
});

export default CustomSelect;
