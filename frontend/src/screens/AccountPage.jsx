import React from 'react'
import { useSelector } from 'react-redux'

const AccountPage = () => {
    const user = useSelector((state) => state.user);
    const {user:userData} = user
  return (
    <div className='page-container'>
        <div className='page-wrapper'>
        <h1>Account</h1>
     
        <div>
          <div className="user-info">
            <p>Name: {userData.name}</p>
            <p>Email: {userData.email}</p>
            <p>Account created: {new Date(userData.createdAt).toLocaleDateString()}</p>
          </div>

          <h2>Update Your Profile</h2>
        
        </div>
    
        </div>
      
    </div>
  )
}

export default AccountPage
