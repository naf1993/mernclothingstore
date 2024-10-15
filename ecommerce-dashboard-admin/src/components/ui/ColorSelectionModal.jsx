import React,{useMemo} from 'react';
import { colorsArray } from 'components/data';
import { Button, Typography, Box } from '@mui/material';
import { Controller } from 'react-hook-form';
import ColorButton from './ColorButton'; // Make sure to import your ColorButton
import CloseButton from './CloseButton'; // Make sure to import your CloseButton
import { HiXMark } from "react-icons/hi2";
const ColorSelectionModal = ({
  control,
  selectedColors,
 
  clearColors,
  removeColor,
  theme
}) => {
  const colorsObjectsArray = useMemo(
    () => colorsArray.map((color) => ({ label: color, value: color })),
    []
  );
  const handleColorChange = (value, onChange) => {
    const newValue = selectedColors.includes(value)
      ? selectedColors.filter(c => c !== value)
      : [...selectedColors, value];
    onChange(newValue);
    
  };

  return (
    <>
      <Typography variant="h6">Select color</Typography>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.2rem",
          maxWidth: "20rem",
        }}
      >
        {colorsObjectsArray.map(({ label, value }) => (
          <Controller
            key={value}
            name="colors"
            control={control}
            render={({ field: { onChange } }) => (
              <ColorButton
                label={label}
                color={value}
                selected={selectedColors.includes(value)}
                onClick={() => handleColorChange(value, onChange)}
              />
            )}
          />
        ))}
      </div>

      <Typography variant="h6">Selected Colors :</Typography>
      <Box
        sx={{
          maxWidth: "320px",
          display: "flex",
          flexWrap: "wrap",
          gap: ".7rem",
          overflow: "hidden",
        }}
      >
        {selectedColors?.map((color, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.8rem 1rem",
              backgroundColor: color,
              maxWidth: "100px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                display: "block",
              }}
            >
              {color}
            </Typography>
            <CloseButton
              onClick={() => removeColor(color)}
              icon={<HiXMark />}
            />
          </Box>
        ))}
      </Box>

      {selectedColors.length > 0 && (
        <Button
          sx={{
            backgroundColor: theme.palette.green.main,
            color: theme.palette.primary.main,
            marginTop: "1rem",
          }}
          type="button"
          onClick={clearColors}
        >
          Clear Colors
        </Button>
      )}
    </>
  );
};

export default ColorSelectionModal;
