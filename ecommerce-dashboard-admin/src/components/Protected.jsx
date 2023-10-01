import React,{useEffect} from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Protected({ children }) {
 
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
 

  return (
    <>{userInfo ? children : <Navigate to="/login" />}</>
  );
}
export default Protected;
