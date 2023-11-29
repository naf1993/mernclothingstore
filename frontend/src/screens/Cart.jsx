import React,{useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const history = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated } = auth;

  useEffect(()=>{
    if(!isAuthenticated){
      return history('/login')
    }
  },[isAuthenticated,history])


  return (
    <div>Cart</div>
  )
}

export default Cart