import React from 'react'
import { Link } from 'react-router-dom'

const SubmenuDropdown = ({submenus,dropdown}) => {
  return (
   <ul className={`dropdown ${dropdown ? "show" : ""}`}>
    {submenus.map((submenu,index)=>(
       <li key={index} className='menu-items-dropdown'>
        <Link className='menu-items-dropdown-item' to={`/products/search/${submenu.name}`}>{submenu.name}</Link>
       </li> 
    ))}
   </ul>
  )
}

export default SubmenuDropdown