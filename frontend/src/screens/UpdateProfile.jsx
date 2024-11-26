import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
//import { updateUserProfile } from '../actions/userActions'; // Assuming you're using Redux for state management
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user: userDetails, isAuthenticated } = useSelector(
    (state) => state.user
  ); // Assuming you store user info in Redux

  // Pre-fill form with existing user data when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setName(userDetails.name);
      setEmail(userDetails.email);
    }
  }, [navigate, userDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic password match validation
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    // // Dispatch action to update user profile
    // dispatch(updateUserProfile({ name, email, password }));
  };

  return (
    <div className="page-container">
      <div className="page-wrapper">
        <h2>Update Profile</h2>

        <form>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={name} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={email} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
