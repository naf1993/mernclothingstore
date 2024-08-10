import React, { useState } from "react";
import { sliderData } from "../data";

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

      {sliderData.map((item, index) => {
        return (
          <div
            key={index}
            className={index === current ? "slide active" : "slide"}
          >
           <>
          
           <img className="slider-img" src={item.src} alt={item.text}/>
           <div className="text-container">
           <h1 className="slider-heading">{item.text}</h1>
           <h3>Get 20% off on your first order</h3>
           <button className="cpn-btn">SUM256</button>
           
           </div>
          
           </>
            {/* <img
              src={item.src}
              style={{ width: "20", height: "29" }}
              alt={item.text}
            />
            <p>{item.text}</p> */}
          </div>
        );
      })}
    </div>
  );
};

export default MainSlider;
