import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={{background:'grey',height:'100vh',width:'100vh'}}>
        <div style={{width:'70%',margin:'0 auto',background:'white'}}>
            <p style={{textAlign:'center'}}>Not Found</p>
            <Link to='/'>Go to home page</Link>
        </div>
    </div>
  )
}

export default NotFound