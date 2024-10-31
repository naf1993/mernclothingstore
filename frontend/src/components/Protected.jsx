import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Protected = ({children}) => {
  const userLogin = useSelector((state)=>state.userLogin)
  const {userInfo} = userLogin
  const isUser = userInfo && userInfo.token && !userInfo.data.user.isAdmin
return (
  <>
  {isUser ? children : <Navigate to='/login'/>}
  </>
)
}
export default Protected