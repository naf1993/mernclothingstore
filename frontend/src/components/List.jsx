import React, { useState, useEffect } from "react";
import axios from "axios";

const List = ({
  catId,
  minPrice,
  maxPrice,
  sort,
  subCats,
  colors,
  ratingsAverage,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  let [products, setProducts] = useState([]);
  // const params = subCats.map((item) => {
  //   return `SubCategory=${item}&`;
  // });

  const price = "price";

  const getAllProductsByCategory = async () => {
    await axios
      .get(`http://localhost:5000/api/products?Category=${catId}`)
      .then((response) => {
        setProducts(response.data.data.products);
      });
  };

  useEffect(() => {
    if (
      colors.length === 0 &&
      minPrice.length === 0 &&
      maxPrice.length === 0 &&
      sort.length === 0 &&
      subCats.length === 0 &&
      ratingsAverage.length === 0
    )
      getAllProductsByCategory();
  }, [
    colors.length,
    minPrice.length,
    maxPrice.length,
    sort.length,
    subCats.length,
    ratingsAverage.length,
  ]);

  const getFilteredProducts = async () => {
    const params = {
      ...(catId && {
        Category: catId,
      }),
      ...(subCats && {
        SubCategory: subCats,
      }),
      ...(minPrice && {
        [`${price + "" + "[gte]"}`]: minPrice,
      }),
      ...(maxPrice && {
        [`${price + "[lte]"}`]: maxPrice,
      }),
      ...(colors && {
        colors: colors,
      }),
      ...(ratingsAverage && {
        [`${ratingsAverage + "" + "[gte]"}`]: ratingsAverage,
      }),
      ...(sort && {
        sort: sort,
      }),
    };

    const { data } = axios.get(`http://localhost:5000/api/products?`, {
      params,
      paramsSerializer: {
        indexes: false,
      },
    });
  };
  useEffect(() => {
    if (
      subCats.length >= 1 ||
      minPrice.length >= 1 ||
      maxPrice.length >= 1 ||
      colors.length >= 1 ||
      sort.length >= 1 ||
      ratingsAverage.length >= 1
    )
      getFilteredProducts();
  }, [
    subCats.length,
    minPrice.length,
    maxPrice.length,
    colors.length,
    sort.length,
    ratingsAverage.length,
  ]);

  return (
    <div className="list">
     
    </div>
  );
};

export default List;
