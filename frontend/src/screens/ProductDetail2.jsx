import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { listProductDetails } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import axios from "axios";
const ProductDetail2 = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [colors, setColors] = useState([]);
  const { loading, error, product } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(listProductDetails(`${id}`));
  }, [id, dispatch]);
  useEffect(() => {
    async function fetchColors() {
      const { data } = await axios.get(
        "http://localhost:5000/api/products/allcolors"
      );

      setColors(data.data.uniqueColors);
    }
    fetchColors();
  }, []);
  let colorsArray = product?.colors || []; // Default to empty array if product.colors is undefined
  const productColors = colors.filter((color) => colorsArray.includes(color));

  console.log(`This is product colors: ${productColors}`);
  return (
    <>
      {loading && <Loader />}
      {error && <Message error={error} />}
      {product && <p>{product.name}</p>}
    </>
  );
};

export default ProductDetail2;
