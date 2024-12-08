import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import StarRating from "./StarRating";
import { Link, useNavigate } from "react-router-dom";
import { addToFavourites, removeFromFavourites } from "../actions/userActions";
import toast from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../actions/apiUrl";

const Product = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, favourites, token } = useSelector(
    (state) => state.user
  );

  const isProductFav =
    favourites?.some((fav) => fav._id === product.id) || false;

  const handleClick = async (e, id) => {
    e.preventDefault();
   // Prevent click event from propagating to the parent div

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

  // const handleView = async (productId, interactionType = "") => {
  //   try {
  //     const sessionId = sessionStorage.getItem("sessionId");
  //     const data = { productId, interactionType };

  //     if (!token && sessionId) {
  //       // For anonymous users, if sessionId exists, include it in the request body
  //       data.sessionId = sessionId;
  //     }

  //     const headers = {};
  //     if (token) {
  //       headers["Authorization"] = `Bearer ${token}`;
  //     }

  //     await axios.post(`${apiUrl}/api/users/addinteraction`, data, {
  //       headers,
  //       withCredentials: true, // Ensure cookies are sent
  //     });
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  return (
    <Link to={`/product/${product.id}`}>
      <div
        // onClick={() => handleView(product.id, "view")}
        // style={{ cursor: "pointer" }}
      >
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
              onClick={(event) => {
                // Prevent handleView from being triggered
                handleClick(event, product.id); // Handle favourite click
              }}
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
              <p className="product-card__detail-price">₹{product.price}</p>
            </div>
            <StarRating rating={product.ratingsAverage} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Product;
