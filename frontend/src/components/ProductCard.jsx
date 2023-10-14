import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { BsEyeglasses } from "react-icons/bs";
import { BsFillStarFill } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import Rating from "./Rating";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };
 

  return (
    <Link
      to={`/products/${product.id}`}
      style={{ textDecoration: "none", color: "grey" }}
    >
      <div className="product-card">
        <figure className="product-card__img">
          <img
            src={
              product.images.length > 0 && isHovered
                ? `http://localhost:3000/public/products/${product.images[0]}`
                : `http://localhost:3000/public/products/${product.imageCover}`
            }
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
          />
        </figure>

        <div className="product-card__icons">
          <AiOutlineHeart className="product-card__icons-item product-card__icons-item-1" />
        </div>

        <div className="product-card__detail">
          <div>
            <h3 className="product-card__detail-name">{product.name}</h3>
            <Rating value={product.ratingsAverage} text={""} />
          </div>

          <div>
            <p className="product-card__detail-price">${product.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
