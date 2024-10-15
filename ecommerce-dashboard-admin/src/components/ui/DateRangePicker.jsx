import React, { useState } from "react";
import { TextField, Box, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers"; // Import LocalizationProvider
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const DateRangePicker = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
  const handleStartDate = (date) => {
    setStartDate(date);
    setError("");
    if (endDate && date > endDate) {
      setError("Start date must be less than end date");
    }
    onDateChange(date, endDate);
  };
  const handleEndDate = (date) => {
    setEndDate(date);
    setError("");
    if (startDate && date < startDate) {
      setError("End date must be greater than start date");
    }
    onDateChange(startDate, date);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2} sx={{marginTop:'.7rem',width:'20rem',margin:'0 auto'}}>
        <Grid item xs={6}>
          <Box
            sx={{
              backgroundColor: "white", // Background color
              borderRadius: "8px",
              // Adjust padding
            }}
          >
            <DatePicker
              sx={{ backgroundColor: "red" }}
              label="Start Date"
              value={startDate}
              onChange={handleStartDate}
              renderInput={(params) => (
                <TextField {...params} error={!!error} helperText={error}   fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    padding: '2px', // Adjust padding
                    height: '25px', // Ensure height is set
                  },
                  '& .MuiFormLabel-root': {
                    fontSize: '0.775rem', // Decrease label font size
                    top: '50%', // Center label vertically
                    transform: 'translateY(-50%)', // Adjust label position
                    left: '10px', // Adjust label position
                  },
                  '& .MuiOutlinedInput-root': {
                    height: '25px', // Adjust overall height
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '& .MuiInputAdornment-root': {
                    marginRight: '0.5rem', // Center icon
                  },
                  '& .MuiButtonBase-root': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  '& .MuiSvgIcon-root': {
                    width: '1.2rem',
                    height: '1.2rem',
                  },
                }} />
              )}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              backgroundColor: "white", // Background color
              borderRadius: '8px', // Adjust padding
            }}
          >
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDate}
              renderInput={(params) => (
                <TextField {...params} error={!!error} helperText={error} fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    padding: '2px', // Adjust padding
                    height: '25px', // Ensure height is set
                  },
                  '& .MuiFormLabel-root': {
                    fontSize: '0.775rem', // Decrease label font size
                    top: '50%', // Center label vertically
                    transform: 'translateY(-50%)', // Adjust label position
                    left: '10px', // Adjust label position
                  },
                  '& .MuiOutlinedInput-root': {
                    height: '25px', // Adjust overall height
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '& .MuiInputAdornment-root': {
                    marginRight: '0.5rem', // Center icon
                  },
                  '& .MuiButtonBase-root': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  '& .MuiSvgIcon-root': {
                    width: '1.2rem',
                    height: '1.2rem',
                  },
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
