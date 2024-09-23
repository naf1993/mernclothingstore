import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Popper,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";


const NotificationAdmin = ({ open, anchor, handleClose, setOpen, setAnchor }) => {
  const notifications = useSelector((state) => state.allnotifications.notifications);
  const notificationList = Array.isArray(notifications) ? notifications : [];
  
  const popperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popperRef.current && !popperRef.current.contains(e.target) && anchor) {
        setOpen(false); // Close the popper
        setAnchor(null); // Clear the anchor element
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchor]);

  return (
    <Popper
      ref={popperRef}
      open={open}
      anchorEl={anchor}
      placement="bottom"
      disablePortal
    >
      <Paper
        sx={{
          maxHeight: 300,
          marginTop: "8px",
          zIndex: 1300,
          overflowY: "auto",
          width: 300,
          borderRadius: "8px", // Rounded corners
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Custom shadow
          backgroundColor: "#ffffff", // Background color
        }}
      >
        <Typography variant="h6" style={{ padding: 16 }}>
          Notifications
        </Typography>
        <List>
          {notificationList.length === 0 ? (
            <ListItem>
              <ListItemText primary="No Notifications" />
            </ListItem>
          ) : (
            notificationList.map((notification, index) => (
              <ListItem key={index}>
                <ListItemText primary={notification.message} />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Popper>
  );
};

export default NotificationAdmin;
