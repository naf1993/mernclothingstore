import React, { useState, useEffect } from "react";
//import { categories } from '../data'
import axios from "axios";
import CategoryItem from "./CategoryItem";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await axios.get(`${apiUrl}/api/categories`);
      setCategories(data.data.categories);
    }
    fetchCategories();
  }, []);

  return (
    <div className="categories-wrapper">
      {categories.map((item, index) => (
        <CategoryItem item={item} key={item.id} index={index} />
      ))}
    </div>
  );
};

export default Categories;
