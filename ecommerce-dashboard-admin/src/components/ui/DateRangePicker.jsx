import React, { useState } from "react";
import { TextField, Box, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
  const [error, setError] = useState("");

  const handleStartDate = (date) => {
    if (endDate && date > endDate) {
      setError("Start date must be less than end date");
    } else {
      setError("");
      onDateChange(date, endDate);
    }
  };

  const handleEndDate = (date) => {
    if (startDate && date < startDate) {
      setError("End date must be greater than start date");
    } else {
      setError("");
      onDateChange(startDate, date);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2} >
        <Grid item xs={6}>
          <Box sx={{ backgroundColor: "white", borderRadius: "8px" }}>
            <DatePicker
             
              value={startDate}
              onChange={handleStartDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!error}
                  helperText={error}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': { padding: '6px 6px', height: '25px' },
                    '& .MuiFormLabel-root': {
                      fontSize: '0.775rem', top: '50%', transform: 'translateY(-50%)', left: '10px',
                    },
                    '& .MuiOutlinedInput-root': { height: '25px', display: 'flex', alignItems: 'center' },
                    '& .MuiInputAdornment-root': { marginRight: '0.5rem' },
                  }} />
              )}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ backgroundColor: "white", borderRadius: '8px' }}>
            <DatePicker
               
              value={endDate}
              onChange={handleEndDate} 
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!error}
                  helperText={error}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': { padding: '2px', height: '25px' },
                    '& .MuiFormLabel-root': {
                      fontSize: '0.775rem', top: '50%', transform: 'translateY(-50%)', left: '10px',
                    },
                    '& .MuiOutlinedInput-root': { height: '25px', display: 'flex', alignItems: 'center' },
                    '& .MuiInputAdornment-root': { marginRight: '0.5rem' },
                  }} />
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
