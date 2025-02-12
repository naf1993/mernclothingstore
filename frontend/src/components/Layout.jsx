import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ChatBot from "./ChatBot";

const Layout = ({ navItems }) => {
  return (
    <div className="wrapper">
      <Navbar navItems={navItems} />

      <Outlet />
      <ChatBot/>

      <Footer />
    </div>
  );
};

export default Layout;
