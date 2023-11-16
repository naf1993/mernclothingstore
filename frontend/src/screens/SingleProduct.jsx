import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { CiShoppingCart } from "react-icons/ci";
const SingleProduct = () => {
  const { id } = useParams();
  console.log(id);
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  useEffect(() => {
    dispatch(listProductDetails(`${id}`));
  }, [dispatch]);

  useEffect(() => {
    console.log(product);
  }, [product]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message severity="error" error={error} />
      ) : (
        <div className="product-detail-wrapper">
          <div className="detail-wrapper">
            <div className="productdisplay-left">
              <div className="productdisplay-img-list">
                <img
                  src={`http://localhost:3000/public/products/${product.imageCover}`}
                />
                <img
                  src={`http://localhost:3000/public/products/${product.imageCover}`}
                />
                <img
                  src={`http://localhost:3000/public/products/${product.imageCover}`}
                />
              </div>
              <div className="productdisplay-img">
                <img
                  className="productdisplay-main-img"
                  src={`http://localhost:3000/public/products/${product.imageCover}`}
                />
              </div>
            </div>
            <div className="productdisplay-right">
              <h2 className="product-category">{product.SubCategory.name}</h2>
              <h1 className="product-name">{product.name}</h1>
              <Rating value={product.ratingsAverage} text={""} />
              <h4 className="product-color">COLORS</h4>
              <div className="buttons-wrapper">
                {product.colors?.map((color, index) => (
                  <span key={index} className="filter-color-btn">
                    <button
                      value={color}
                      type="submit"
                      style={{
                        backgroundColor: `${color}`,
                      }}
                    />
                  </span>
                ))}
              </div>
              <h4 className="product-size">SIZE</h4>
              <button type="submit" className="submit-btn"><CiShoppingCart className="addcart-icon" style={{width:'1.2rem',height:'1.2rem'}}/><span className="btn-title">Add to Cart</span></button>
                      <p>Estimated Delivery Time: 21 November - 28 November</p>
                      <h4 className="product-details">Product Details
                        </h4>   
                        <p>Product Details: 8834941</p>
                        <p>Return within "30 days". For detailed information, Click.</p>
                        <p>Fabric Info: 100% BARKCLOTH</p>
            </div>
            {/* <div className="left">
              <div className="left__item left__item--1">
              
                <img className="left__img"
                  src={`http://localhost:3000/public/products/${product.imageCover}`}
                />
              
              </div>
             
            </div>
            <div className="right">right</div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
