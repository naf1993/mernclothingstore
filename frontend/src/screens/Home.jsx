import React from "react";
import Categories from "../components/Categories";

import Policy from "../components/Policy";

import ProductsSlider from "../components/ProductsSlider";
import NewProducts from "../components/NewProducts";
import HomeCategories from "../components/HomeCategories";


const Home = () => {
  return (
    <div className="home">
      {/* <Categories /> */}
      <Policy />

      <ProductsSlider />
     <HomeCategories/>
      <NewProducts />
    </div>
  );
};

export default Home;
