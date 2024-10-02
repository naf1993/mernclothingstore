// Sidebar.js
import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { styled } from "@mui/material/styles";

const Logo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const Sidebar2 = ({ drawerOpen, drawerToggle }) => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Products", icon: <Inventory2Icon /> },
    { text: "Customers", icon: <GroupIcon /> },
    {text:'Orders',icon:<GradingIcon/>}
  ];

  return (
    <Drawer
      variant="permanent"
      open={drawerOpen}
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <Logo>
        <Typography variant="h6">My Logo</Typography>
      </Logo>
      <Divider />
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={index}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar2;
