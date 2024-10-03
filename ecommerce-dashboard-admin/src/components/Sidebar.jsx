import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Drawer, useMediaQuery,List,ListItem,ListItemIcon, ListItemText } from "@mui/material";
import {Link} from 'react-router-dom'
import PerfectScrollbar from "react-perfect-scrollbar";
import { BrowserView, MobileView } from "react-device-detect";
import { drawerWidth } from "constants/theme";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import GradingIcon from "@mui/icons-material/Grading";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from '@mui/icons-material/Dashboard';

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />,url:'/' },
  { text: "Products", icon: <Inventory2Icon /> ,url:'/products/table'},
  { text: "Customers", icon: <GroupIcon />,url:'/customers/table' },
  {text:'Orders',icon:<GradingIcon/>,url:'/orders'}
];
const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  const theme = useTheme();

  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));

  const drawer = (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Box sx={{ display: "flex", p: 2, mx: "auto" }}>logo</Box>
      </Box>
      <BrowserView>
      <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd ? "calc(100vh - 56px)" : "calc(100vh - 88px)",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <List sx={{marginTop:'2rem'}}>
            {menuItems.map((item, index) => (
              <ListItem button component={Link} to={item.url} key={index}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </PerfectScrollbar>
       
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2 }}>hello mobil</Box>
      </MobileView>
    </>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;
  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : "auto" }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant={matchUpMd ? "persistent" : "temporary"}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            zIndex:800,
            background: theme.palette.background.white,
            color: theme.palette.primary.textcolor,
            borderRight: "none",
            [theme.breakpoints.up("md")]: {
              top: "88px",
            },
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
