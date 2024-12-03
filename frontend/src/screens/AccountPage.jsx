import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "../actions/userActions";

const AccountPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { user: userdetails, isAuthenticated } = user;
  const handleLogout = () => {
    dispatch(logOutUser());
    navigate("/");
  };

  const handleMyOrders = () => {
    navigate("/orders");
  };

  const handleUpdateProfile = () => {
    navigate("/updateProfile");
  };
  if (!isAuthenticated) {
    navigate("/login");
  }

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <h2 className="account-heading">Welcome, {userdetails.name}!</h2>
        <p className="account-email">Email: {userdetails.email}</p>

        <div className="user-actions">
          <button className="btn-user-actions" onClick={handleMyOrders}>
            My Orders
          </button>
          <button className="btn-user-actions" onClick={handleUpdateProfile}>
            Update Profile
          </button>
          <button
            className="btn-user-actions btn-logout"
            onClick={handleLogout}
          >
            Logout
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
