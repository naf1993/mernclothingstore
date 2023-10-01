import React, { useState } from "react";
import { useTheme, styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  Grid,
  InputAdornment,
  OutlinedInput,
  Popper,
} from "@mui/material";
import Transitions from "./Transitions";
import PopupState, { bindPopper, bindToggle } from "material-ui-popup-state";
import { HiAdjustments } from "react-icons/hi";
import { BsSearch } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { shouldForwardProp } from "@mui/system";

const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
  zIndex: 1100,
  width: "99%",
  top: "-55px !important",
  padding: "0 12px",
  [theme.breakpoints.down("sm")]: {
    padding: "0 10px",
  },
}));

const OutlinedInputStyle = styled(OutlinedInput, { shouldForwardProp })(
  ({ theme }) => ({
    width: 434,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 15,
    "& input": {
      background: "transparent !important",
      paddingLeft: "4px !important",
    },
    [theme.breakpoints.down("lg")]: {
      width: 250,
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "white",
    },
  })
);

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(
  ({ theme }) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
    "&:hover": {
      background: theme.palette.secondary.dark,
      color: theme.palette.secondary.light,
    },
  })
);

const MobileSearch = ({ value, setValue, popupState }) => {
  const theme = useTheme();
  return (
    <OutlinedInputStyle
      id="input-search-header"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search"
      startAdornment={
        <InputAdornment position="start">
          <BsSearch
            stroke="1.5"
            size="1rem"
            color={theme.palette.primary.iconcolor2}
          />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <ButtonBase sx={{ borderRadius: "12px" }}>
            <HeaderAvatarStyle variant="rounded">
              <HiAdjustments stroke="1.5" size="1.3" />
            </HeaderAvatarStyle>
          </ButtonBase>
          <Box sx={{ ml: 2 }}>
            <ButtonBase sx={{ borderRadius: "12px" }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  background: theme.palette.orange.light,
                  color: theme.palette.orange.dark,
                  "&:hover": {
                    background: theme.palette.orange.dark,
                    color: theme.palette.orange.light,
                  },
                }}
                {...bindToggle(popupState)}
              >
                <AiOutlineClose stroke="1.5" size="1.3rem" />
              </Avatar>
            </ButtonBase>
          </Box>
        </InputAdornment>
      }
      aria-describedby="search-helper-text"
      inputProps={{ "aria-label": "weight" }}
    />
  );
};

const SearchSection = () => {
  const theme = useTheme();
  const [value, setValue] = useState("");
  return (


    <>
    {/* on mobile devices */}
    <Box sx={{display:{xs:'block',md:'none'}}}>
      <PopupState variant="popper" popupId="demo-popup-popper">
        {(popupState)=>(
          <>
          <Box sx={{ml:2}}>
            <ButtonBase sx={{borderRadius:'12px'}}>
              <HeaderAvatarStyle variant="rounded" {...bindToggle(popupState)}>
                <BsSearch stroke="1.5" size='1.2rem'/>
              </HeaderAvatarStyle>
            </ButtonBase>
          </Box>
          <PopperStyle {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                  <>
                    <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                      <Card
                        sx={{
                          background: '#fff',
                          [theme.breakpoints.down('sm')]: {
                            border: 0,
                            boxShadow: 'none'
                          }
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs>
                              <MobileSearch value={value} setValue={setValue} popupState={popupState} />
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </Transitions>
                  </>
                )}
              </PopperStyle>
          </>
        )}
      </PopupState>

    </Box>
      {/* on large screen */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <OutlinedInputStyle
          id="input-search-header"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <BsSearch
                stroke="1.5"
                size="1rem"
                color={theme.palette.primary.iconcolor2}
              />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <ButtonBase sx={{ borderRadius: "12px" }}>
                <HeaderAvatarStyle variant="rounded">
                  <HiAdjustments stroke={1.5} size="1.3rem" />
                </HeaderAvatarStyle>
              </ButtonBase>
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          inputProps={{ "aria-label": "weight" }}
        />
      </Box>
    </>
  );
};

export default SearchSection;
