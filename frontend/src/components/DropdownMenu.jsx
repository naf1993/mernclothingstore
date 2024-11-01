import React from "react";
import { Link } from "react-router-dom";
import { logOutUser } from "../actions/userActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const DropdownMenu = ({ submenus, dropdown ,category}) => {
  const dispatch = useDispatch()
  const history = useNavigate()
  const logoutHandler = ()=>{
    dispatch(logOutUser())
    return history('/')
    
  }
  return (
    <ul className={`dropdown ${dropdown ? "show" : ""}`}>
      {submenus.map((submenu, index) => (
        <li key={index} className="menu-items-dropdown">
          {(submenu.url && category) ? (
            <Link to={`/products/category/${category}`} className="menu-items-dropdown-item">
            {submenu.title}
          </Link>
          )
        :(submenu.url) ? ( <Link to={submenu.url} className="menu-items-dropdown-item">
        {submenu.title}
      </Link>):(
          <button type='button' aria-haspopup='menu' className='dropdown-menu-item db-btn' onClick={()=>logoutHandler()}>
        {submenu.title} </button>
        )}
          
        </li>
      ))}
    </ul>
  );
};

export default DropdownMenu;
