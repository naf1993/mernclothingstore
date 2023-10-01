import React from "react";


const image1 = require("../images/hijab.png");
const image2 = require("../images/maintunic.png");
const image3 = require("../images/abaya1.png");
const image4 = require("../images/jeanmain.png");
const image5 = require("../images/skirt.png");
const Header = () => {
  return (
    <div className="header-gallery">
      <div className="item-1">
       <div className="text-main">
          <h1 className="banner-header-main">HIJABS</h1>
         
          <button className="banner-button-primary">SHOP</button>
        </div>
        <figure className="image-main">
         <img src={image1} className='main-img' alt='hijab' /> 
        </figure>
        
      </div>

      <div className="item-2">
      <div className="text-secondary">
          <h1 className="banner-header-secondary">TUNICS</h1>
         
          <button className="banner-button-secondary">SHOP</button>
        </div>
         <figure className="image-secondary">
          
         <img src={image2} className='banner-image-secondary' alt='hijab' />
         </figure>
        
      </div>

      <div className="item-3">
      <div className="text-secondary">
          <h1 className="banner-header-secondary">GOWNS</h1>
         
          <button className="banner-button-secondary">SHOP</button>
        </div>
        <figure className="image-secondary">
          
         <img src={image3} className='banner-image-secondary' alt='hijab' />
        </figure>
        
      </div>

      <div className="item-4">
      <div className="text-secondary">
          <h1 className="banner-header-secondary">COATS</h1>
         
          <button className="banner-button-secondary">SHOP</button>
        </div>
        <figure className="image-secondary">
          
         <img src={image4} className='banner-image-secondary' alt='hijab' />
        </figure>
        
        
      </div>
      <div className="item-5">
      <div className="text-secondary">
          <h1 className="banner-header-secondary">SKIRTS</h1>
         
          <button className="banner-button-secondary">SHOP</button>
        </div>
        <figure className="image-secondary">
          
         <img src={image5} className='banner-image-secondary' alt='hijab' />
        </figure>

      </div>

    

      {/* <div class="gallery-item gallery-item--2">
        <div className="gallery-item gallery-item--1">
          <img src={image1} className="header-gallery__img" alt="img" />
        </div>
      </div>
      <div class="gallery-item gallery-item--3">
        <div className="gallery-item gallery-item--1">
          <img src={image3} className="header-gallery__img" alt="img" />
        </div>
      </div>
      <div class="gallery-item gallery-item--4">
        <div className="gallery-item gallery-item--1">
          <img src={image4} className="header-gallery__img" alt="img" />
        </div>
      </div>
      <div class="gallery-item gallery-item--5">
        <div className="gallery-item gallery-item--1">
          <img src={image5} className="header-gallery__img" alt="img" />
        </div>
      </div> */}
    </div>
  );
};
export default Header;
