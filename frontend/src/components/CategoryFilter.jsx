import React,{useEffect,useState} from "react";
import { Link } from "react-router-dom";
import SubCategoryFilter from "./SubCategoryFilter";
import { AiFillCaretDown } from "react-icons/ai";
import {useRef} from 'react'
import SubmenuDropdown from "./SubmenuDropdown";

const CategoryFilter = ({ items, index }) => {
    const ref = useRef()
    const [dropdown,setDropdown] = useState(false)

    const closeDropdown = () => {
        dropdown && setDropdown(false)
    }
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
    <li key={index} className="category-item"  ref={ref} onClick={closeDropdown} onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}>
   {items.subcategories && (items.subcategories.length > 0) ? (
    <>
    
    <button type="button" aria-haspopup="menu" className='dropdown-menu-item' aria-expanded={dropdown ? "true" : "false"} onClick={()=>setDropdown((prev)=>!prev)}>
       {items.name}
        </button>
    <SubmenuDropdown submenus={items.subcategories} dropdown={dropdown} category={items.name}/>

    </>
   ):(
    <Link className="category-link" to={`/products/search/${items.name}`}>
    <span className="category-title">{items.name}</span>
    <AiFillCaretDown className="category-icon"/>
   </Link>
   )}
    
      
       
      

      {/* )} */}
    </li>
  );
};

export default CategoryFilter;
