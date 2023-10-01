import React from 'react'
import DropdownMenu from './DropdownMenu'
import { useState,useEffect } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'



const UserNav = ({items,user}) => {
    const ref = useRef()
    
    const [dropdown,setDropdown] = useState(false)

    const closeDropdown = () => {
        dropdown && setDropdown(false);
      };

    useEffect(() => {
        const handler = (event) => {
         if (dropdown && ref.current && !ref.current.contains(event.target)) {
          setDropdown(false);
         }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
         // Cleanup the event listener
         document.removeEventListener("mousedown", handler);
         document.removeEventListener("touchstart", handler);
        };
       }, [dropdown]);
       const onMouseEnter = () => {
        window.innerWidth > 960 && setDropdown(true);
       };
       
       const onMouseLeave = () => {
        window.innerWidth > 960 && setDropdown(false);
       };
  return (
   <li className="menu-items" ref={ref} onClick={closeDropdown} onMouseEnter={onMouseEnter}
   onMouseLeave={onMouseLeave}>
   {items.submenu ? (
    <span className='dropdown-link'>
    <span className='item-icon'>{items.icon}</span>
     {user ? ( <button type='button' aria-haspopup='menu' className='dropdown-menu-item' aria-expanded={dropdown ? "true" : "false"} onClick={()=>setDropdown((prev)=>!prev)}>
        {user.name}{' '} </button>):
        (
           <button type='button' aria-haspopup='menu' className='dropdown-menu-item' aria-expanded={dropdown ? "true" : "false"} onClick={()=>setDropdown((prev)=>!prev)}>
           {items.title}{' '}
       </button>
        )}
    
        
    
   
    <DropdownMenu submenus={items.submenu} dropdown={dropdown} />

    </span>
   ):(
    <Link className='menu-item' to={items.url}>
        <span className='item-icon'>{items.icon}</span>
        <span className='item-title'>
        {items.title}</span></Link>
    )}

    
   </li>
  )
}

export default UserNav