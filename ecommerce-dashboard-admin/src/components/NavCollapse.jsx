import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import NavItem from "./NavItem";

import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  List,
} from "@mui/material";
import KeyboardArrowUpOutlined from "@mui/icons-material/KeyboardArrowUpOutlined";
import  KeyboardArrowDown  from "@mui/icons-material/KeyboardArrowDown";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useLocation, useNavigate } from "react-router-dom";

const NavCollapse = ({ menu, level }) => {
 
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { pathname } = useLocation;

  const handleClick = () => {
    setOpen(!open);
    setSelected(!selected ? menu.id : null);

  
    navigate(menu.children[0]?.url);
  };
  const checkOpenForParent = (child, id) => {
    child.forEach((item) => {
      if (item.url === pathname) {
        setOpen(true);
        setSelected(id);
      }
    });
  };

  useEffect(() => {
    setOpen(false);
    setSelected(null);
    if (menu.children) {
      menu.children.forEach((item) => {
        if (item.children?.length) {
          checkOpenForParent(item.children, menu.id);
        }
        if (item.url === pathname) {
          setSelected(menu.id);
          setOpen(true);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menu.children]);

  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case "collapse":
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case "item":
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const Icon = menu.icon;
  const menuIcon = menu.icon ? (
    <Icon
      strokeWidth={1.5}
      size="1.3rem"
      style={{ marginTop: "auto", marginBottom: "auto" }}
    />
  ) : (
    <FiberManualRecordIcon
      sx={{
        width: selected === menu.id ? 8 : 6,
        height: selected === menu.id ? 8 : 6,
      }}
      fontSize={level > 0 ? "inherit" : "medium"}
    />
  );
  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: "5px",
          mb: 0.5,
          alignItems: "flex-start",
          backgroundColor: level > 1 ? "transparent !important" : "inherit",
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 24}px`,
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: !menu.icon ? 18 : 36 }}>
          {menuIcon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant={selected === menu.id ? "h5" : "body1"}
              color="inherit"
              sx={{ my: "auto" }}
            >
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  color: "grey",
                  textTransform: "capitalize",
                }}
                display="block"
                gutterBottom
              >
                {menu.caption}
              </Typography>
            )
          }
        >
          {open ? (
            <KeyboardArrowUpOutlined
              stroke={1.5}
              size="1.5rem"
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          ) : (
            <KeyboardArrowDown
              stroke={1.5}
              size="1.5rem"
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          )}
        </ListItemText>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            position: "relative",
            "&:after": {
              content: "''",
              position: "absolute",
              left: "32px",
              top: 0,
              height: "100%",
              width: "1px",
              opacity: 1,
              background: "#eef2f6",
            },
          }}
        >
          {menus}
        </List>
      </Collapse>
    </>
  );
};
NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
};

export default NavCollapse;
