import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authenticateAdmin } from "../../actions/userActions";
import Loader from "../../components/loader/Loader";
import Message from "../../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import image1 from "../../loginimage.jpg";

import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error,userInfo } = userLogin;
 
  useEffect(() => {
    if (userInfo) {
      if(userInfo.data.user.isAdmin){
      
      return navigate("/");
      }
     
    }
  }, [userInfo, navigate]);

  // const isAdmin = useSelector((state) => state.userLogin.isAdmin);
  // console.log(isAdmin)

  const submitHandler = (e) => {
    e.preventDefault();
   
    dispatch(authenticateAdmin(email, password));
    
  };
  return (
    <div className="login-container">
      <div className="wrapper">
        <div className="image-container">
          <figure className="image-figure">
            <img src={image1} className="login-img" alt="hijab" />{" "}
          </figure>
        </div>

        <div className="form-container">
          <div className="logo">
            <h1 className="logo">
              <Link to="/" className="site-title">
                The Modest Store
              </Link>
            </h1>
          </div>
          <span className="login-text">Sign into your Account</span>
          {error && <Message severity="error" error={error} />}
          {loading && <Loader />}
          <form className="login-form" onSubmit={submitHandler}>
            <input
              name="email"
              className="formcontrol"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              name="password"
              className="formcontrol"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>

          <Link to="/forgetpassword" className="forget-password">
            <span>Forgot Password?</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
