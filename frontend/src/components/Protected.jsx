import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Protected = ({children}) => {
  const user = useSelector((state)=>state.user)
  const {isAuthenticated} = user
 
return (
  <>
  {isAuthenticated ? children : <Navigate to='/login'/>}
  </>
)
}
export default Protected