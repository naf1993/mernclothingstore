import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Protected = ({children}) => {
  const userLogin = useSelector((state)=>state.userLogin)
  const {userInfo} = userLogin
  const isAdmin = userInfo && userInfo.data && userInfo.data.user.isAdmin
return (
  <>
  {isAdmin ? children : <Navigate to='/login'/>}
  </>
)
}
export default Protected