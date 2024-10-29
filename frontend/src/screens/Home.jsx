import React, { useEffect } from "react";
import Categories from "../components/Categories";

import Policy from "../components/Policy";

import ProductsSlider from "../components/ProductsSlider";
import NewProducts from "../components/NewProducts";
import HomeCategories from "../components/HomeCategories";
import MainSlider from "../components/MainSlider";
import Review from "../components/Review";
import NewsLetterSubscription from "../components/NewsLetterSubscription";
import MultiCarousel from "../components/MultiCarousel";
import { listProducts } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.product);
  useEffect(() => {
    console.log("calling products from effect");
    dispatch(listProducts());
  }, [dispatch]);

  const newProducts =
    Array.isArray(products) && products.length > 0
      ? products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];
  const featuredProducts =
    Array.isArray(products) && products.length > 0
      ? products.filter((item) => item.isFeatured)
      : [];

  return (
    <div className="home">
      <MainSlider />
      <Policy />
      {loading && <Loader />}
      {error && <Message error={error} />}
      {products && products.length > 0 && (
        <MultiCarousel items={newProducts} heading="Explore New Collection" />
      )}
      
      <HomeCategories />
      {loading && <Loader />}
      {error && <Message error={error} />}
      {products && products.length > 0 && (
        <MultiCarousel items={featuredProducts} heading="Top Selling" />
      )}

      

      <Review />
      <NewsLetterSubscription />
    </div>
  );
};

export default Home;
