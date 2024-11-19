import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = ({ navItems }) => {
  return (
    <div className="wrapper">
      <Navbar navItems={navItems} />

      <Outlet />

      <Footer />
    </div>
  );
};

export default Layout;
