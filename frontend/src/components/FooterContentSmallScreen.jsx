import React from "react";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";

const FooterContentSmallScreen = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const location = useLocation();
  const handleHomeClick = () => {
    navigate("/"); // Navigate to the home page
  };

  const handleUserClick = () => {
    navigate("/account"); // Navigate to the user account page
  };

  const isHome = location.pathname === "/";
  const isUser = location.pathname === "/account";

  return (
    <div className="footer-container-sm">
      <button
        className={`footer-container-smbtn ${isHome ? "active" : ""}`}
        onClick={handleHomeClick}
      >
        <AiOutlineHome />
      </button>
      <button
        className={`footer-container-smbtn ${isUser ? "active" : ""}`}
        onClick={handleUserClick}
      >
        <AiOutlineUser />
      </button>
    </div>
  );
};

export default FooterContentSmallScreen;
