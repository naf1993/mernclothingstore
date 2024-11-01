import React, { useEffect, useState } from "react";
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
  
  // Determine if the product is a favorite based on Redux state
  const isProductFav = favourites?.includes(product.id) || false;
  const [isFav, setIsFav] = useState(isProductFav);

  useEffect(() => {
    // Sync local state with Redux state when component mounts
    setIsFav(isProductFav);
  }, [isProductFav]);

  const handleClick = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      if (isFav) {
        await dispatch(removeFromFavourites(id));
        setIsFav(false); // Update local state
        toast.success("Removed from favourites");
      } else {
        await dispatch(addToFavourites(id));
        setIsFav(true); // Update local state
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
            {isFav ? (
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
