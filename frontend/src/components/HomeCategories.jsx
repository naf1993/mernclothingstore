import React, { useState, useEffect } from "react";
import axios from "axios";
import SingleCategory from "./SingleCategory";
import Headings from "./Headings";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { getCategories } from "../actions/productActions";

const HomeCategories = () => {
  const dispatch = useDispatch();
  const { loading, error, categories } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);
  return (
    <>
      <div className="heading">
        <Headings>Explore Latest Categories</Headings>
      </div>
      {loading && <Loader />}
      {error && <Message error={error} />}
      {categories && categories.length > 0 && (
        <div className="home-categories">
          {categories.map((item, index) => (
            <SingleCategory item={item} key={item.id} index={index} />
          ))}
        </div>
      )}
    </>
  );
};

export default HomeCategories;
