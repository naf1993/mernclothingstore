import React from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { menuItems } from "../menuItems";
import MenuItems from "./MenuItems";
import { useLocation } from "react-router-dom";
import { usernav } from "../usernav";
import { useraccounts } from "../usernav";
import UserNav from "./UserNav";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const Navbar = ({ navItems }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const submitHandler = (e) => {
 
    navigate(query ? `/search/?query=${query}` : `/search`);
  };
  const depthLevel = 0;
  const { pathname } = useLocation();

  const auth = useSelector((state) => state.auth);
  const { user } = auth;

  if (pathname === "/login" || pathname === "/register") {
    return <></>;
  }

  return (
    <div className="navbar">
      <div className="navbar-wrapper">
        <h1 className="logo">
          <Link to="/" className="site-title">
            The Modest Store
          </Link>
        </h1>

        <form onSubmit={submitHandler}>
          <div className="searchbox-wrapper">
            <input
              type="text"
              name='query'
              id='query'
              className="search__input"
              onSubmit={(e)=>{
                setQuery(e.target.value)
                console.log(e.target.value)
              }}
              placeholder="Search for Abaya,Hijabs.."
            />
            <button className="search__button">
              <BsSearch className="search__icon" />
            </button>
          </div>
        </form>
        <ul className="user-nav">
          {user
            ? useraccounts.map((menu, index) => {
                return <UserNav items={menu} key={index} user={user} />;
              })
            : usernav.map((menu, index) => {
                return <UserNav items={menu} key={index} />;
              })}
        </ul>

        <div className="mega-menu">
          <ul className="mega-menu__nav">
            {menuItems.map((menu, index) => {
              return (
                <MenuItems items={menu} key={index} depthLevel={depthLevel} />
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
