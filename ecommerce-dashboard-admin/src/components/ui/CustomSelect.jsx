// src/components/ui/CustomSelect.jsx
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
    <FormControl fullWidth variant="outlined" margin="normal" error={Boolean(error)}>
      <InputLabel>{label}</InputLabel>
      <Select
        ref={ref}
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
});

export default CustomSelect;
