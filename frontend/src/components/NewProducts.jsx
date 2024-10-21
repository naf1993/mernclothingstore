import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import Headings from "./Headings";

import Product from "./Product";
import { listProducts } from "../actions/productActions";

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

const NewProducts = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.product);
  console.log(products);
  const newProducts = products.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  console.log(newProducts);
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <div className="products-slider">
      <div className="heading">
        <Headings>New Products</Headings>
      </div>

      <div className="slider">
        {loading && <Loader />}
        {error && <Message error={error} />}
        {newProducts && newProducts.length > 0 && (
          <Carousel responsive={responsive} containerClass="carousel-container">
            {newProducts.map((product) => (
              <Product
                key={product.id}
                product={product}
               
              />
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default NewProducts;
