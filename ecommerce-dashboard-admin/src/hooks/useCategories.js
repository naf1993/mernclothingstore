// useCategories.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/categories');
      const options = data.data.categories.map(category => ({
        value: category.id,
        label: category.name,
      }));
      setCategories(options);
    } catch (err) {
      setError(err);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubcategories = useCallback(async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    setLoading(true);
    try {
      console.log(`Fetching subcategories for category ID: ${categoryId}`);
      const { data } = await axios.get(`http://localhost:5000/api/categories/${categoryId}`);
      const options = data.data.category.subcategories.map(subcategory => ({
        value: subcategory.id,
        label: subcategory.name,
      }));
      console.log('Fetched subcategories:', options);
      setSubcategories(options);
    } catch (err) {
      setError(err);
      toast.error("Failed to load subcategories.");
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, subcategories, fetchSubcategories, loading, error };
};

export default useCategories;
