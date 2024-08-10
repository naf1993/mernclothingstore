import PropTypes from 'prop-types'
import React from "react";
import NavCollapse from "./NavCollapse";
import NavItem from "./NavItem";
import { Divider, List, Typography } from "@mui/material";

const NavGroup = ({ item }) => {
  
  const items = item.children?.map((menu) => {
    switch (menu.type) {
      case "collapse":
        return <NavCollapse key={menu.id} menu={menu} />;
      case "item":
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="red" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });
  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "black",
                padding: "6px",
                textTransform: "capitalize",
                marginTop: "10px",
              }}
              display="block"
              gutterBottom
            >
              {item.title}
              {item.caption && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    color: "grey",
                    textTransform: "capitalize",
                  }}
                >
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>
      <Divider sx={{mt:0.5,mb:1.25}}/>
    </>
  );
};
NavGroup.propTypes = {
    item:PropTypes.object
}

export default NavGroup;
