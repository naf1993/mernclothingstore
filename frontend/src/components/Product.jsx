import React, { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BsEyeglasses } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Rating from "./Rating";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideModal,openModal } from '../actions/productModalActions';
import { BsFillStarFill } from "react-icons/bs";
import ProductModel from "./ProductModel";

const Product = ({product,selectedProduct}) => {
 
  const dispatch = useDispatch();
  const modal = useSelector((state)=>state.productModal.modal)
  
  const toggleProductModal = ()=>{
    dispatch(openModal())
   }
  const [isShown, setIsShown] = useState(false);

  // this function is called when the mouse hovers over box A
  const handleMouseOver = () => {
    setIsShown(true);
  };

  // this function is called when the mouse out box A
  const handleMouseOut = () => {
    setIsShown(false);
  };

  return (
    <div>
     
    <div
      className="product-card"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={()=>selectedProduct(product)}
     
    >
      <img
        src={`${product.images[0]}`}
        alt="image"
        className="product-card__img"
      />
      {isShown && (
        <div className="product-card__icons">
          <AiOutlineHeart className="product-card__icons-item product-card__icons-item-1" />
          <BsEyeglasses className="product-card__icons-item product-card__icons-item-1" />
        </div>
      )}

      {isShown && (
        <div className="product-card__action">
          <button   className="product-card__action-btn"  onClick={toggleProductModal}>
            <AiOutlineShoppingCart className="product-card__action-btn-icon" />
            Add To Cart
          </button>
        </div>
      )}

      <div className="product-card__detail">
        <p className="product-card__detail-category">{product.Category.name}</p>
        <h3 className="product-card__detail-name">{product.name}</h3>
        <p className="product-card__detail-price">${product.price}</p>
        <div className="product-card__detail-icons">
          <BsFillStarFill />
          <BsFillStarFill />
          <BsFillStarFill />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Product;
