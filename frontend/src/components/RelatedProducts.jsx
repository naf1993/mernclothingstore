import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import ProductCard from "./ProductCard";
import Message from './Message'

const RelatedProducts = ({ categoryId, productId,categoryName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  const getRelatedProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/products/relatedproducts/${productId}/${categoryId}`
      );
      setRelatedProducts(data.data.products);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
    }
  };


  useEffect(() => {
    getRelatedProducts();
  }, []);

  return <>
  <div className='heading'>
        <h2>DISCOVER NEW {categoryName.toUpperCase()}</h2>
      </div>
  
  <div className="related-products-wrapper">
  {loading ? (<Loader/>) : error ? ( <Message severity="error" error={error} />) : (relatedProducts.length === 0) ? (<p>no products</p>) : (
     <>
     {relatedProducts.map((product,index)=>(
      <div key={index}>
        <ProductCard product={product}/>
      </div>
     ))}
     </>
    )}

  </div></>;
};

export default RelatedProducts;
