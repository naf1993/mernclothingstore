import React from "react";
import Categories from "../components/Categories";

import Policy from "../components/Policy";

import ProductsSlider from "../components/ProductsSlider";
import NewProducts from "../components/NewProducts";
import HomeCategories from "../components/HomeCategories";
import MainSlider from "../components/MainSlider";
import Review from "../components/Review";
import NewsLetterSubscription from "../components/NewsLetterSubscription";
import MultiCarousel from "../components/MultiCarousel";


const Home = () => {
  const items = [
    <div>Item 1</div>,
    <div>Item 2</div>,
    <div>Item 3</div>,
    <div>Item 4</div>,
    <div>Item 5</div>,
    <div>Item 6</div>,
  ];
  return (
    <div className="home">
      <MainSlider/>
      <Policy />
      <HomeCategories/>
      <ProductsSlider />
      
      
    
      <NewProducts />
      <Review/>
      <NewsLetterSubscription/>
      <MultiCarousel items={items} itemsToShow={2}/>
     
    </div>
  );
};

export default Home;
