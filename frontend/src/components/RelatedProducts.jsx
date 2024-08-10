import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import ProductCard from "./ProductCard";
import Message from './Message'

const RelatedProducts = ({ categoryId, product,categoryName  }) => {
  const { id } = product
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let [relatedProducts, setRelatedProducts] = useState([]);



  const getRelatedProducts = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/products/relatedproducts/${id}/${categoryId}`
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
        <h2>DISCOVER NEW {(categoryName?.toUpperCase())}</h2>
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
