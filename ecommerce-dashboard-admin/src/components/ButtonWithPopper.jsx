import React, { useState, forwardRef, useRef } from "react";
import {
  Popper,
  Paper,
  Typography,
  Button,
  Menu,
  MenuItem,
  ButtonBase,
  Avatar,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Badge,
  Divider,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ButtonWithPopper = forwardRef(
  (
    {
      icon,

      popperContent,
      userMenu,
      onClick,

      setFilter,
      handleRead,
      markAllasRead, // Function to mark all as read
    },
    ref
  ) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
      setOpen((prev) => !prev);
      if (!open) {
        if (typeof markAllasRead === "function") {
          markAllasRead(); // Call the function if it's defined
        } else {
          console.error("markAllAsRead is not a function");
        }
      }
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    };
    const handleMenuItemClick = (item) => {
      handleClose({target:null});
      if (item.type === "link") {
        navigate(item.path);
      } else if (item.type === "button") {
        item.onClick();
      }
    };

    return (
      <>
        <ButtonBase
          sx={{ borderRadius: "12px" }}
          ref={anchorRef}
          onClick={(e) => {
            handleToggle();
            onClick && onClick(e);
          }}
          color="inherit"
        >
          <Badge
            badgeContent={popperContent?.filter((n) => !n.isRead).length}
            color="error"
          >
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: "all .2s ease-in-out",
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
                '&[aria-controls="menu-list-grow"],&:hover': {
                  background: theme.palette.secondary.dark,
                  color: theme.palette.secondary.light,
                },
              }}
            >
              {icon}
            </Avatar>
          </Badge>
        </ButtonBase>

        {userMenu ? (
          <Menu
            anchorEl={anchorRef.current}
            open={open}
            onClose={handleClose}
            keepMounted
          >
            {userMenu.map((item, index) => (
              <MenuItem key={index} onClick={() => handleMenuItemClick(item)}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        ) : (
          <Popper
            open={open}
            anchorEl={anchorRef.current}
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
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography variant="h6" style={{ padding: 16 }}>
                Notifications
              </Typography>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  style={{
                    background: theme.palette.info.main,
                    border: "none",
                  }}
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  style={{
                    background: theme.palette.success.main,
                    border: "none",
                  }}
                  onClick={() => setFilter("read")}
                >
                  Read
                </Button>
                <Button
                  style={{
                    background: theme.palette.warning.main,
                    border: "none",
                  }}
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </Button>
              </Box>

              <List>
                {popperContent?.map((notification) => (
                  <React.Fragment key={notification._id}>
                    <ListItem
                      style={{
                        background: notification.isRead ? "#f1f1f1" : "#e7f3fe",
                        borderLeft: `4px solid ${
                          notification.type === "product_created"
                            ? "#28a745"
                            : "#dc3545"
                        }`,
                      }}
                    >
                      <ListItemText
                        primary={notification.message}
                        secondary={`Type: ${notification.type}`}
                      />
                      {!notification.isRead && (
                        <Button
                          variant="outlined"
                          onClick={() => handleRead(notification._id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Popper>
        )}
      </>
    );
  }
);

export default ButtonWithPopper;
