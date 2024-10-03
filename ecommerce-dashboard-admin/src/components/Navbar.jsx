import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { AiOutlineUser } from "react-icons/ai";
import { TOGGLE_LIGHT_DARK } from "../actions/themeActions";
import { Box, IconButton, useTheme, ButtonBase, Avatar } from "@mui/material";
import { io } from "socket.io-client";
import { BiMenu } from "react-icons/bi";
import SearchSection from "./SearchSection";

import {
  fetchAllNotifications,
  addNotification,
  markAllAsRead,
} from "../actions/notificationAction";
import { logout } from "actions/userActions";

import ButtonWithPopper from "./ButtonWithPopper";
import { BsBell } from "react-icons/bs";

const Navbar = ({ handleLeftDrawerToggle }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const notifications = useSelector(
    (state) => state.allnotifications.notifications
  );
  const notificationList = Array.isArray(notifications) ? notifications : [];
  const [filter, setFilter] = useState("all");
  const userMenu = [
    { label: "Settings", type: "link", path: "/settings" },
    { label: "Logout", type: "button" },
  ];

  const [screenSize, setScreenSize] = useState(undefined);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"],
  });

  useEffect(() => {
    dispatch(fetchAllNotifications());

    socket.on("notification", (newNotification) => {
      dispatch(addNotification(newNotification));
      setOpen(true);
      setAnchor(document.getElementById("notification-btn"));
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [dispatch]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };
  const filteredNotifications = notificationList
    .filter((item) => {
      if (filter === "read") return item.isRead;
      if (filter === "unread") return !item.isRead;
      return true; //all
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Box
        sx={{
          width: 228,
          display: "flex",
          [theme.breakpoints.down("md")]: {
            width: "auto",
          },
        }}
      >
        <Box
          component="span"
          sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}
        >
          ADMIN
        </Box>
        <ButtonBase sx={{ borderRadius: "12px", overflow: "hidden" }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: "all .2s ease-in-out",
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              "&:hover": {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <BiMenu stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />
      <FlexBetween gap="1rem">
        <IconButton onClick={() => dispatch({ type: TOGGLE_LIGHT_DARK })}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined sx={{ fontSize: "25px" }} />
          ) : (
            <LightModeOutlined sx={{ fontSize: "25px" }} />
          )}
        </IconButton>

        <ButtonWithPopper
          markAllasRead={handleMarkAllAsRead}
          icon={<BsBell />}
          popperContent={filteredNotifications}
          setFilter={setFilter}
        />
        <ButtonWithPopper
          icon={<AiOutlineUser />}
          userMenu={userMenu.map((item) => ({
            ...item,
            onClick: item.type === "button" ? handleLogout : undefined,
          }))}
        />
      </FlexBetween>
    </>
  );
};

export default Navbar;
