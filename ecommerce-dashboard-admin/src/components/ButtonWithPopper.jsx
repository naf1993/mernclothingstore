// components/ButtonWithPopper.js
import React, { useState, forwardRef ,useRef} from "react";
import {
  IconButton,
  Popper,
  Paper,
  ClickAwayListener,
  Typography,
  
  Menu,
  MenuItem,
  ButtonBase,Avatar,List,ListItem,ListItemText,useTheme,Badge
} from "@mui/material";

const ButtonWithPopper = forwardRef(
  ({ icon, badgeContent, popperContent, userMenu, onClick }, ref) => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const anchorRef = React.useRef(null);
    const popperRef = useRef(null);
    const handleToggle = () => {
      setOpen((prev) => !prev);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
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
            <Badge badgeContent={badgeContent} color="secondary">
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
          {/* {badgeContent !== undefined && (

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
          )} */}
        </ButtonBase>

        {userMenu ? (
          <Menu
            anchorEl={anchorRef.current}
            open={open}
            onClose={handleClose}
            keepMounted
          >
            {userMenu.map((item, index) => (
              <MenuItem key={index} onClick={handleClose}>
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        ) : (
          <Popper ref={popperRef}
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
                      borderRadius: "8px", // Rounded corners
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Custom shadow
                      backgroundColor: "#ffffff", // Background color
                    }}
                  >
                    <Typography variant="h6" style={{ padding: 16 }}>
                      Notifications
                    </Typography>
                    <List>
                      {popperContent.length === 0 ? (
                        <ListItem>
                          <ListItemText primary="No Notifications" />
                        </ListItem>
                      ) : (
                        popperContent.map((notification, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={notification.message} />
                          </ListItem>
                        ))
                      )}
                    </List>
                  </Paper>
               
          </Popper>
        )}
      </>
    );
  }
);

export default ButtonWithPopper;
