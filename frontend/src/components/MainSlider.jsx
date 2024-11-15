import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {checkIsFirstOrder } from '../actions/orderActions'
import toast from "react-hot-toast";
export const sliderData = [
  { src: "/assets/images/abaya1.png", text: "Explore Latest Abayas" },

  { src: "/assets/images/skirt.png", text: "Modest Wear Collection" },
];

const MainSlider = () => {
  const dispatch = useDispatch();
  const { loading, error, isFirstOrder } = useSelector((state) => state.order);
  const [current, setCurrent] = useState(0);
  const length = sliderData.length;
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(current === length - 1 ? 0 : current + 1);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [current, length]);
  useEffect(() => {
    dispatch(checkIsFirstOrder());
  }, []);

  const handleCopyCoupon = () => {
    const couponCode = 'GET20'
    navigator.clipboard.writeText(couponCode).then(()=>{
      toast.success(`Coupon copied to clpboard: ${couponCode}`)
    }).catch((err)=>{
      toast.error(`Failed to copy coupon code`,err)
    })
  }

  return (
    <div className="main-slider-wrapper">
      {sliderData.map((item, index) => (
        <div
          key={index}
          className={index === current ? "slide active" : "slide"}
        >
          <div className="image-container">
            <img className="slider-img" src={item.src} alt={item.text} />
          </div>
          <div className="text-container">
            <h1 className="slider-heading">{item.text}</h1>
            {isFirstOrder && (
              <>
                <h3>Get 20% off on your first order</h3>
                <button onClick={handleCopyCoupon} className="cpn-btn">GET20</button>
              </>
            )}
          
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainSlider;
