import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { loginUserWithEmail } from "../actions/userActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../actions/apiUrl";
import { FcGoogle } from "react-icons/fc";
const image1 = require("../img/loginimage.jpg");


const Login = () => {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { isAuthenticated,error,isLoading } = user;
  


  useEffect(() => {
    if (isAuthenticated) {
      return history("/");
    }
  }, [isAuthenticated, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loginUserWithEmail(email, password));
  };
  const googleLogin = () => {
    window.open(`${process.env.REACT_APP_WEB_URL}/auth/google`, "_self");
  };
  return (
    <div className="login-container">
      <div className="wrapper-login">
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
          {error && <Message variant="danger" error={error} />}
          {isLoading && <Loader />}
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
          <button
            onClick={googleLogin}
              type="submit"
              className="google-btn"
            >
              <FcGoogle
                className="google-icon"
                style={{ marginRight: ".7rem", fontSize: "1.8rem" }}
              />
              Sign In With Google
            </button>

          <Link to="/forgetpassword" className="forget-password">
            <span>Forgot Password?</span>
          </Link>
          <div className="register">
            <span>
              Dont have an account? <Link className="register-link" to="/register">Register here</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
