import React from "react";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { menuItems } from "../menuItems";
import MenuItems from "./MenuItems";
import { useLocation } from "react-router-dom";
import { usernav } from "../usernav";
import { BsHeart } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { BsCart } from "react-icons/bs";
import UserNav from "./UserNav";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

const Navbar = ({ navItems }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const depthLevel = 0;
  const { pathname } = useLocation();
  const user = useSelector((state) => state.user);
  const {loading,error,categories} = useSelector((state)=>state.product)
  const { user:userPresent,favourites } = user;
  const useraccounts = [
    {
      title: "Favourites",
      url: "/favourites",
      icon: <BsHeart />,
      count:favourites?.length
    },
    {
      title: "Cart",
      url: "/cart",
      icon: <BsCart />,
    },
    {
      title: "",
      icon: <CiUser />,
      submenu: [
        {
          title: "Orders",
          url: "/orders",
        },
        {
          title: "My Account",
          url: "/myaccount",
        },
       {
        title:'Log out',
        action:'logout'
        
       }
      ],
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/?searchText=${searchText}`);
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {      
        handleSubmit();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

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

        <form onSubmit={handleSubmit} className="searchbox-wrapper">
          <input
            type="text"
            value={searchText}
            className="search__input"
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search for Abaya,Hijabs.."
          />
          <button className="search__button">
            <BsSearch className="search__icon" />
          </button>
        </form>

        <ul className="user-nav">
          {userPresent
            ? useraccounts.map((menu, index) => {
                return <UserNav items={menu} key={index} user={userPresent} />;
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
