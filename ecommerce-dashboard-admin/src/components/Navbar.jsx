import React, { useState,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import profileImage from '../assets/profile.jpeg'
import { TOGGLE_LIGHT_DARK } from "../actions/themeActions";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  ButtonBase,
  Avatar
} from "@mui/material";
import { fontSize, textTransform } from "@mui/system";
import {BiMenu} from 'react-icons/bi'
import SearchSection from "./SearchSection";
import ProfileSection from "./ProfileSection";
import Notification from "./Notification";


const Navbar = ({handleLeftDrawerToggle }) => {
 
  const dispatch = useDispatch()
  const darkMode = useSelector((state)=>state.theme.darkMode)
  const theme = useTheme()

  const [screenSize, setScreenSize] = useState(undefined);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  
  return (
    <>
    <Box sx={{width:228,display:'flex',[theme.breakpoints.down('md')]:{
      width:'auto'
    }}}>
      <Box component='span' sx={{display:{xs:'none',md:'block'},flexGrow:1}}>
        logo
      </Box>
      <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <BiMenu stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
    </Box>
 

      {/* <FlexBetween gap='1.5rem'>
        <IconButton  onClick={() => dispatch({type:TOGGLE_LIGHT_DARK})}>
        {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
        </IconButton>
        <IconButton>
          <SettingsOutlined sx={{ fontSize: "25px" }}/>
        </IconButton>
        <FlexBetween>
          <Button
          sx={{display:'flex',justifyContent:'space-between',alignItems:'center',textTransform:'none',gap:'1rem'}}>
            <Box component='img' src={profileImage} alt='profile' height='32px' width='32px' borderRadius='50%' sx={{objectFit:'cover'}}/>
            <Box textAlign='left'>
              <Typography fontWeight='bold' fontSize='0.85rem' sx={{color:theme.palette.primary.textcolor}}>
                Admin
              </Typography>
              <Typography
                  fontSize="0.75rem"
                  sx={{ color: theme.palette.primary.textcolor }}
                >
                  Developer
                </Typography>
            </Box>
            <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary.main, fontSize: "25px" }}
              />
          </Button>
          <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem onClick={handleClose}>Log Out</MenuItem>
            </Menu>
        </FlexBetween>
      </FlexBetween> */}
      <SearchSection/>
      <Box sx={{flexGrow:1}}/>
      <Box sx={{flexGrow:1}}/>
      <Notification/>
      <ProfileSection/>

   
  </>
  )
}

export default Navbar