import React, { useEffect, useRef, useState } from "react";
import Product from "./Product";
import Headings from "./Headings";
import { AiOutlineLeft,AiOutlineRight } from "react-icons/ai";

const MultiCarousel = ({ items, autoScroll, heading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(5); // Default to 4 items
  const [startX, setStartX] = useState(0);
  const intervalRef = useRef(null);
  
  const updateItemsToShow = () => {
    const width = window.innerWidth
    if(width < 404){
      setItemsToShow(1)
    }
    else if(width >= 404 && width <= 488) {
      setItemsToShow(2)
    }
    else if(width >=488 && width <=590){
      setItemsToShow(2)
    }
    else if(width >=590 && width <=760){
      setItemsToShow(3)
    }
    else if (width >= 760 && width < 900){
      setItemsToShow(4)
    }
    else {
      setItemsToShow(5)
    }
  }
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const currentX = e.touches[0].clientX;
    if (startX - currentX > 50) {
      handleNext();
    } else if (currentX - startX > 50) {
      handlePrev();
    }
  };

  const handleNext = () => {
    if (items.length <= 1) return;

    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + itemsToShow;
      return nextIndex >= items.length ? 0 : nextIndex; // Wrap around
    });
  };

  const handlePrev = () => {
    if (items.length <= 1) return;

    setCurrentIndex((prevIndex) => {
      const prevIndexValue = prevIndex - itemsToShow;
      return prevIndexValue < 0 
        ? Math.floor((items.length - 1) / itemsToShow) * itemsToShow 
        : prevIndexValue; // Wrap around
    });
  };


  const handleDotClick = (index) => {
    setCurrentIndex(index * itemsToShow);
  };

  useEffect(() => {
    updateItemsToShow(); // Initial check
    window.addEventListener("resize", updateItemsToShow); // Update on resize

    if (autoScroll) {
      intervalRef.current = setInterval(handleNext, 3000);
    }
    
    return () => {
      window.removeEventListener("resize", updateItemsToShow);
      clearInterval(intervalRef.current);
    };
  }, [autoScroll]);

  useEffect(() => {
    if (items.length > 0) {
      setCurrentIndex(0); // Reset to the first index if items change
    }
  }, [items]);
  return (
    <div className="carousel-container">
      <div className="heading">
        <Headings>{heading}</Headings>
      </div>
      <div className="carousel" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
       
      {/* {items.length > 1 && (
          <button onClick={handlePrev} className="carousel-button left">
            <AiOutlineLeft />
          </button>
        )} */}

        <div className="carousel-images">
          {items
            .slice(currentIndex, currentIndex + itemsToShow)
            .map((item, index) => {
             
              return <Product key={item.id} product={item} />;
            })}
        </div>
        {/* {items.length > 1 && (
          <button onClick={handleNext} className="carousel-button right">
            <AiOutlineRight />
          </button>
        )} */}
        <div className="dots">
          {Array.from({ length: Math.ceil(items.length / itemsToShow) }).map(
            (_, index) => (
              <span
                key={index}
                className={`dot ${
                  currentIndex / itemsToShow === index ? "active" : ""
                }`}
                onClick={() => handleDotClick(index)}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiCarousel;
