import React, { useEffect, useRef, useState } from "react";
import Product from "./Product";

const MultiCarousel = ({ items, itemsToShow, autoScroll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const intervalRef = useRef(null);
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
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsToShow < items.length ? prevIndex + itemsToShow : 0
    );
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsToShow >= 0
        ? prevIndex - itemsToShow
        : Math.floor(items.length / itemsToShow) * itemsToShow
    );
  };
  const handleDotClick = (index) => {
    setCurrentIndex(index * itemsToShow);
  };

  useEffect(() => {
    if (autoScroll) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoScroll]);
  return (
    <div
      className="carousel"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <button onClick={handlePrev} className="carousel-button">
        Prev
      </button>
      <div className="carousel-container">
        {items
          .slice(currentIndex, currentIndex + itemsToShow)
          .map((item, index) => {
            console.log("Item before passing to Product:", item); // Check item
            return <Product key={item.id} product={item} />;
          })}
      </div>
      <button onClick={handleNext} className="carousel-button">
        Next
      </button>
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
  );
};

export default MultiCarousel;
