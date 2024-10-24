import React from 'react'
import {AiOutlineHome, AiOutlineUser} from 'react-icons/ai'

const FooterContentSmallScreen = () => {
  return (
    <div className='footer-container'>
        <button>
            <AiOutlineHome/>
            <span>Home</span>
        </button>
        <button>
            <AiOutlineUser/>
            <span>User</span>
        </button>
    </div>
  )
}

export default FooterContentSmallScreen
