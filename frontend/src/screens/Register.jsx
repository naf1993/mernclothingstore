import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch,useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { registerWithEmail } from '../actions/authActions';

const image1 = require("../images/loginimage.jpg");
const Register = () => {
  const history = useNavigate()
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setconfirmPassword] = useState('')
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated,error,isLoading } = auth;
  const [message,setMessage] = useState(null)

  useEffect(()=>{
    if(isAuthenticated){
      return history('/')
    }
  },[isAuthenticated,history])
  
  
  const submitHandler = (e)=>{
    e.preventDefault()
    if(password !== confirmPassword){
      setMessage('Password do not match')
    }
    else{
      dispatch(registerWithEmail(name,email,password))
     
      
    }
   
  }
  return (
   <div className='login-container'>
   <div className='wrapper'>
   
    <div className="image-container">
      <figure className='image-figure'>
         <img src={image1} className='login-img' alt='hijab' /> </figure>
        </div>
 
    <div className='form-container'>
      <div className='logo'>
      <h1 className="logo">
          <Link to="/" className="site-title">
            The Modest Store
          </Link>
        </h1>

      </div>
      <span className='login-text'>Register your Account</span>
      {message && <Message variant='warning' error={message}/>}
      {error && <Message variant='danger' error={error}/>}
      {isLoading && <Loader />}
      <form className='login-form' onSubmit={submitHandler}>
      <input
              name="text" className='formcontrol'
              type="name"  placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)}
            />

            <input
              name="email" className='formcontrol'
              type="email"  placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)}
            />
         
            <input
              name="password" className='formcontrol'
              type="password" placeholder='Password'
              value={password} onChange={(e)=>setPassword(e.target.value)}
            />
             <input
              name="confirmPassword" className='formcontrol'
              type="password" placeholder='Confirm Password'
              value={confirmPassword} onChange={(e)=>setconfirmPassword(e.target.value)}
            />
        
          <button type="submit" className='login-btn'>Register</button>
        </form>
       
         
          <div className='register'>
          <span>Already have account? <Link to='/login'>Login</Link></span>
        </div>
    </div>
   </div>
   </div>
  )
}

export default Register