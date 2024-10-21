import React, { useState } from "react";

export const sliderData = [
  {src:'/assets/images/abaya1.png',text:'Explore Latest Abayas'},
 
  {src:'/assets/images/skirt.png',text:'Modest Wear Collection'},

]

const MainSlider = () => {
  const [current, setCurrent] = useState(0);
  const length = sliderData.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };
  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };
  return (
    <div className="main-slider-wrapper">
      <span>
        <button className="buttonSlide" onClick={prevSlide} />
        <button className="buttonSlide" onClick={nextSlide} />
      </span>

      {sliderData.map((item, index) => (
        <div key={index} className={index === current ? "slide active" : "slide"}>
          <div className="image-container">
            <img className="slider-img" src={item.src} alt={item.text} />
          </div>
          <div className="text-container">
            <h1 className="slider-heading">{item.text}</h1>
            <h3>Get 20% off on your first order</h3>
            <button className="cpn-btn">SUM256</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainSlider;
