import React, { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import StarRating from "./StarRating";
import { Link, useNavigate } from "react-router-dom";
import { addToFavourites } from "../actions/userActions";
import toast from "react-hot-toast";

const Product = ({ product, selectedProduct }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated } = auth;
  const { favourites } = useSelector((state) => state.user);
  const isFavourite = favourites?.includes(product.id);
  const [isProductFav, setIsProductFav] = useState(isFavourite);

  useEffect(() => {
    setIsProductFav(favourites?.includes(product.id)); // Update state based on current favourites
  }, [favourites, product.id]);

  const handleClick = (e, id) => {
    console.log("Before Prevent Default"); // Log here
    e.preventDefault();
    e.stopPropagation();
    console.log("Button Clicked"); // Prevent navigation on click

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    console.log("Checking if product is already a favorite");
    if (isProductFav) {
      toast.info("Already in favorites");
      return;
    }
    console.log("Dispatching addToFavourites action"); // Add this lin
    console.log("adding to favourites");
    dispatch(addToFavourites(id))
      .then(() => {
        setIsProductFav(true);
        toast.success("Added to favorites");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    // <Link to={`products/${product.id}`}>
      <div>
        <div className="product-card">
          <img
            src={`${product.images[0]}`}
            alt="image"
            className="product-card__img"
          />

          <div className="product-card__icons">
            <button
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
   // </Link>
  );
};

export default Product;
