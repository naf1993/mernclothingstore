import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getColors, listProductDetails } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import axios from "axios";
import StarRating from "../components/StarRating";
import ProductImage from "../components/ProductImage";
const ProductDetail2 = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [colors, setColors] = useState([]);
  const { loading, error, product } = useSelector((state) => state.product);
  const { colors: allColors } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(listProductDetails(`${id}`));
  }, [id, dispatch]);
  useEffect(() => {
    dispatch(getColors());
  }, [product, dispatch]);

  useEffect(() => {
    if (product && product.colors && allColors && allColors.length > 0) {
      let uniqueColors = allColors.filter((color) =>
        product.colors.includes(color)
      );
      setColors(uniqueColors);
    }
  }, [product, product.colors, allColors, allColors.length]);

  return (
    <>
      {loading && <Loader />}
      {error && <Message error={error} />}
      {product && (
        <div className="product-detail-wrapper">
          <div className="detail-wrapper">
            <div className="productdisplay-left">
              {product.images && product.images.length > 0 && (
                <ProductImage images={product.images} />
              )}
            </div>

            <div className="productdisplay-right">
              <h2 className="product-category">
                {product.SubCategory && product.SubCategory.name}
              </h2>
              <h1 className="product-name">{product.name}</h1>
              <StarRating rating={product.ratingsAverage} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail2;
