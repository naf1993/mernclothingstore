import React, { useEffect, useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import Headings from "./Headings";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";

import Product from "./Product";

import axios from "axios";

export const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 1024 },
    items: 4,
    slidesToSlide: 2,
  },
  desktop: {
    breakpoint: { max: 1024, min: 800 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 800, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const ProductsSlider = () => {
  let [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      const { data } = await axios.get(
        "http://localhost:5000/api/products?isFeatured=true"
      );

      setFeaturedProducts(data.data.products);
    }
    fetchFeaturedProducts();
  }, [setFeaturedProducts]);
  return (
    <div className="products-slider">
      <div className='heading'>
     <Headings>Top Sellers</Headings>
      </div>
      <div className="slider">
        <Carousel responsive={responsive} containerClass="carousel-container">
          {featuredProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default ProductsSlider;

/* {loading ? (<Loader/>):error ? (<Message severity='error' error={error}/>):(
            products.map((product)=>(
              <Product key={product._id} product={product}/>
            ))
          )}*/
