import React, { useEffect, useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import Headings from "./Headings";

import Product from "./Product";
import { openModal } from "../actions/productModalActions";
import axios from "axios";
import ProductModel from "./ProductModel";

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
  let [newProducts, setNewProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
 const [modalData,setModalData] = useState([])
 const dispatch = useDispatch();
 const modal = useSelector((state)=>state.productModal.modal)
const [name,setName] = useState()
const [price,setPrice] = useState()
const [image,setImage] = useState()
const [description,setDescription] = useState()


 const selectedProduct = (data)=>{
  dispatch(openModal())
  setName(data.name)
  setPrice(data.price)
  setImage(data.imageCover)
  setDescription(data.description)

 }

  const fetchNewProducts = async () => {
    await axios
      .get("http://localhost:5000/api/products?sort=-createdAt")
      .then((response) => {
        setNewProducts(response.data.data.products);
      });
  };
  useEffect(() => {
    fetchNewProducts();
  }, []);
  return (
    <div className="products-slider">
     <div className='heading'>
     <Headings>New Products</Headings>
      </div>
      {modal && <ProductModel name={name} setName={setName} price={price} setPrice={setPrice} image={image} setImage={setImage} description={description} setDescription={setDescription}/>}
      <div className="slider">
        <Carousel responsive={responsive} containerClass="carousel-container">
          {newProducts.map((product) => (
           
            <Product key={product.id} product={product} selectedProduct={selectedProduct}/>
          
         
          ))}
        </Carousel>
      </div>
    
     
    </div>
  );
};

export default NewProducts;
