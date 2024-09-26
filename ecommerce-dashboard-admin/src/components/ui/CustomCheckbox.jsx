import React from 'react';
import { Controller } from 'react-hook-form';
import { Checkbox, FormControlLabel, styled } from '@mui/material';

// Styled component for the checkbox
const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    margin: 0, // Remove margin from FormControlLabel
    '& .MuiCheckbox-root': {
      margin: 0, // Remove margin from Checkbox
    },// Adjust margin as needed
    '& .MuiFormControlLabel-label': {
      marginLeft: '0px', // Adjust margin between checkbox and label
    },
  }));

const CustomStyledCheckbox = styled(Checkbox)(({ theme }) => ({
  '&.Mui-checked': {
    color: theme.palette.secondary.dark,
  },
  '&.Mui-checked:hover': {
    backgroundColor: theme.palette.primary.light, // Optional hover effect
  },
  margin:'0'
}));

const CustomCheckbox = ({ control, name, label, value }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value: currentValue = [] } }) => (
        <CustomFormControlLabel
          control={
            <CustomStyledCheckbox sx={{margin:'0'}}
              checked={currentValue.includes(value)}
              onChange={(e) => {
                const newValue = e.target.checked
                  ? [...currentValue, value]
                  : currentValue.filter((item) => item !== value);
                onChange(newValue);
              }}
            />
          }
          label={label} labelPlacement='start'
        />
      )}
    />
  );
};

export default CustomCheckbox;
