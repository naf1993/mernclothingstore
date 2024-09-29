import React from "react";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CloseButton = ({ onClick, icon }) => {
    const theme = useTheme()
  return (
    <Button
    variant="contained"
    onClick={onClick}
    sx={{
      backgroundColor: theme.palette.primary.main,
      border: "none",
      position: "absolute",
      top: 0,
      right: 0,
      minWidth: "30px", // Adjusted for better clickable area
      padding: "0",
      color: theme.palette.primary.contrastText, // Use contrastText for better readability
      "&:hover": {
        backgroundColor: theme.palette.orange.main,
      },
      "& svg": {
        width: "1rem", // Adjusted size for visibility
        height: "1rem",
        color: theme.palette.grey[600], // Use theme for consistent color
      },
    }}
  >
    {icon}
  </Button>
  );
};

export default CloseButton;
