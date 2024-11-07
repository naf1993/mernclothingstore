import React, { useState, useContext } from "react";
import { Button, FormControl, Box, TextField } from "@mui/material";
import { useTheme } from "@mui/material";
import { ModalContext } from "components/CustomModal1";


const AddCoupon = ({ onAdd, disabled }) => {
  const { close } = useContext(ModalContext);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const theme = useTheme();
  const [error, setError] = useState("");

  const handleAddCoupon = async () => {
    if (!code.trim || discount <= 0) {
      setError("Please enter a valid coupon code and discount");
      return;
    }
    setError("");

    await onAdd(code, discount);
  };
  return (
    <FormControl fullWidth>
      <TextField sx={{backgroundColor:'white'}}
        label="Coupon Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!error}
        helperText={error}
      />
      <TextField sx={{backgroundColor:'white'}}
        label="Discount (%)"
        type="number"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
        error={!!error} // Show error style if there's an error
        helperText={error} // Display error message
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "1rem",
        }}
      >
        <Box sx={{ flex: 1 }}></Box>

        <Button disabled={disabled}
          sx={{
            backgroundColor: theme.palette.green.main,
            marginRight: "1rem",textTransform:'uppercase'
          }}
          onClick={handleAddCoupon}
        >
          Add Coupon
        </Button>
        <Button
          sx={{ backgroundColor: theme.palette.error.main,textTransform:'uppercase' }}
          onClick={() => close()}
        >
          Cancel
        </Button>
      </Box>
    </FormControl>
  );
};

export default AddCoupon;
