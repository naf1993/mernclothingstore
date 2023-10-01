import React from 'react'
import { Link } from 'react-router-dom'

const FilterSidebar = ({categories,handleChange}) => {
  return (
    <div className='filter-wrapper'>
     <div className='wrapper'>
      <h4>Category</h4>
      <ul className=''>
   {categories.map((category,index)=>(
    <li key={index}>
      {categories.subcategories && categories.subcategories.length > 0 ?  (
        <ul>
          {categories.subcategories.map((subcategory,index)=>(
            <li key={index}>
              <Link to={`/products/search/${subcategory.name}`}>{subcategory.name}</Link>
            </li>
          ))}
        </ul>
      ):(
        <Link to={`/products/search/${category.name}`}>{category.name}</Link>
      )}
    </li>
   ))}
      </ul>
     </div>
    </div>
  )
}

export default FilterSidebar
