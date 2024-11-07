import React, { useState, useContext } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { ModalContext } from "components/CustomModal1";


const EditOrder = ({ orderStatus, orderId, onEdit, isUpdatingOrder }) => {
  const { close } = useContext(ModalContext);
  const theme = useTheme();
  const [status, setStatus] = useState(orderStatus);
  const handleStatusChange = async () => {
    await onEdit(orderId, status);
  };
  return (
    <FormControl fullWidth>
      <InputLabel>Order Status</InputLabel>
      <Select value={status} onChange={(e) => setStatus(e.target.value)}  sx={{
          backgroundColor: "white", // Set background color to white
          "& .MuiSelect-select": {
            padding: "10px", // Optional: add padding for better appearance
          },
        }}>
        <MenuItem value="Not Processed">Not Processed</MenuItem>
        <MenuItem value="Processing">Processing</MenuItem>
        <MenuItem value="Dispatched">Dispatched</MenuItem>
        <MenuItem value="Cancelled">Cancelled</MenuItem>
        <MenuItem value="Delivered">Delivered</MenuItem>
      </Select>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop:'1rem'
        }}
      >
        <Box sx={{ flex: 1 }}></Box>

        <Button
          disabled={isUpdatingOrder}
          sx={{ backgroundColor: theme.palette.green.main,marginRight:'1rem' }}
          onClick={handleStatusChange}
        >
          Update Status
        </Button>
        <Button
          sx={{ backgroundColor: theme.palette.error.main }}
          onClick={() => close()}
        >
          Cancel
        </Button>
      </Box>
    </FormControl>
  );
};

export default EditOrder;
