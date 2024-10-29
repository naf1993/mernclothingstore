import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BsEyeglasses } from "react-icons/bs";
import StarRating from "./StarRating";

const Product = ({ product, selectedProduct }) => {
  return (
    <div>
      <div className="product-card">
        <img
          src={`${product.images[0]}`}
          alt="image"
          className="product-card__img"
        />

        <div className="product-card__icons">
          <AiOutlineHeart className="product-card__icons-item product-card__icons-item-1" />
          <BsEyeglasses className="product-card__icons-item product-card__icons-item-1" />
        </div>

        <div className="product-card__detail">
          <div>
            <h3 className="product-card__detail-name">{product.name}</h3>
            <p className="product-card__detail-price">${product.price}</p>
          </div>
          
            <StarRating rating={product.ratingsAverage} />
          
        </div>
      </div>
    </div>
  );
};

export default Product;
