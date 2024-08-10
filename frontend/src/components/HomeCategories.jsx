import React, { useState,useEffect } from 'react'
import axios from 'axios'
import SingleCategory from './SingleCategory'
import Headings from './Headings'

const HomeCategories = () => {

    const [categories,setCategories] = useState([])
    useEffect(() => {
        async function fetchCategories() {
          const { data } = await axios.get("http://localhost:5000/api/categories");
         setCategories(data.data.categories)
         
        
        }
        fetchCategories();
      }, []);
  return (
    <>
    
     <div className='heading'>
     <Headings>Explore Latest Categories</Headings>
      </div>
    <div className='home-categories'>
     
    {categories.map((item,index)=>(
         <SingleCategory item={item} key={item.id} index={index} />
        ))}
    </div>
  </>
  )
}

export default HomeCategories