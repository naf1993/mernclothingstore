import React from "react";
import { AiOutlineHeart, AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { BsCart } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const FooterContentSmallScreen = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const { isAuthenticated } = user;

  const isHome = location.pathname === "/";
  const isUser = location.pathname === "/account";
  const isCart = location.pathname === "/cart";
  const isFav = location.pathname === "/favourites";

  return (
    <div className="footer-container-sm">
      <button
        className={`footer-container-smbtn ${isHome ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
        <AiOutlineHome />
      </button>
      {isAuthenticated && (
        <>
          <button
            className={`footer-container-smbtn ${isCart ? "active" : ""}`}
            onClick={() => navigate("/cart")}
          >
            <BsCart />
          </button>
          <button
            className={`footer-container-smbtn ${isFav ? "active" : ""}`}
            onClick={() => navigate("/favourites")}
          >
            <AiOutlineHeart />
          </button>
        </>
      )}

      <button
        className={`footer-container-smbtn ${isUser ? "active" : ""}`}
        onClick={() => navigate("/account")}
      >
        <AiOutlineUser />
      </button>
    </div>
  );
};

export default FooterContentSmallScreen;
