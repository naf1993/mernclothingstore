import React from "react";
import { Link } from "react-router-dom";

const SingleCategory = ({ item, index }) => {
  return (
    <div className={`item-${index + 1}`}>
      <div className={`text-main-${index + 1}`}>
        <h1 className={`banner-text-${index + 1}`}>{item.name}</h1>
        <Link to={`/products/category/${item.id}`}>
          <button className={`banner-btn-${index + 1}`}>SHOP</button>
        </Link>
      </div>
      <figure className={`image-container-${index + 1}`}>
        <img
          src={`./public/categories/${item.categoryImage}`}
          alt="hijab"
          className={`image-${index + 1}`}
        />
      </figure>
    </div>
  );
};

export default SingleCategory;
