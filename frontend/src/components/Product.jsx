import React, { useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import StarRating from "./StarRating";
import { Link, useNavigate } from "react-router-dom";
import { addToFavourites, removeFromFavourites } from "../actions/userActions";
import toast from "react-hot-toast";

const Product = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, favourites } = useSelector((state) => state.user);
  
 
  const isProductFav = favourites?.some(fav => fav._id === product.id) || false;

  const handleClick = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      if (isProductFav) {
        await dispatch(removeFromFavourites(id));
        toast.success("Removed from favourites");
      } else {
        await dispatch(addToFavourites(id));
        toast.success("Added to favourites");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="product-card">
        <img
          src={product.images[0]}
          alt="image"
          className="product-card__img"
        />
        <div className="product-card__icons">
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
            }}
            onClick={(event) => handleClick(event, product.id)}
            className="icon-button"
            type="button"
          >
            {isProductFav ? (
              <AiFillHeart className="product-card__icons-item-2" />
            ) : (
              <AiOutlineHeart className="product-card__icons-item-1" />
            )}
          </button>
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
