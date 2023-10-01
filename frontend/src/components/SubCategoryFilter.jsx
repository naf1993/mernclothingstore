import React from 'react'
import { Link } from 'react-router-dom'

const SubCategoryFilter = ({submenus}) => {
  return (
  <ul>
    {submenus.map((submenu,index)=>(
        <li key={index}>
            <Link to={`/products/search/${submenu.name}`}>{submenu.name}</Link>
        </li>
    ))}
  </ul>
  )
}

export default SubCategoryFilter
