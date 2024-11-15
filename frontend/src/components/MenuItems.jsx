import React, { useEffect } from 'react'
import DropdownMenu from './DropdownMenu'
import { useState } from 'react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

const MenuItems = ({items,depthLevel}) => {
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
    {items.submenu && items.url && items.category ? (
      <>
        <button type="button" aria-haspopup="menu" className='dropdown-menu-item' aria-expanded={dropdown ? "true" : "false"} onClick={()=>setDropdown((prev)=>!prev)}>
          <span className='dropdown-icon'>{items.icon}</span>{items.title}{' '}
        </button>
        <DropdownMenu  categoryId={items.categoryId} submenus={items.submenu} dropdown={dropdown}  />
      </>
    ) : (
      <Link className='menu-item' to={`/products/${items.category}/${items.url}`}>
        <span className='item-title'>
        {items.title}</span></Link>
    )}
  </li>
  )
}

export default MenuItems