import React from 'react'
import {Link} from 'react-router-dom'

const userDropdown = ({submenus,dropdown}) => {
  return (
    <ul className={`dropdown ${dropdown ? "show":""}`}>
        {submenus.map((submenu,index)=>(
            <li key={index} className='menu-items-dropdown'>
                <Link to = {submenu.url} className='menu-items-dropdown-item'>{submenu.title}</Link>
            </li>
        ))}
    </ul>
  )
}

export default userDropdown