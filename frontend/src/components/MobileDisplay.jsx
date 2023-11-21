import React from "react";
import Rating from "../components/Rating";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const MobileDisplay = ({ product, ifSize }) => {
  return (
    <>
      <div className="mobile-wrapper">
        <h2 className="product-category">{product.SubCategory.name}</h2>
        <h1 className="product-name">{product.name}</h1>
        <Rating value={product.ratingsAverage} text={""} />
        <div className="accord-item">
          {product.colors && (
            <div className="accord-header">
              <h4 className="product-color">COLORS</h4>
              <FaAngleDown />
            </div>
          )}
          {product.colors && (
            <div className="accord-details">
              <div className="buttons-wrapper">
                {product.colors?.map((color, index) => (
                  <span key={index} className="filter-color-btn">
                    <button
                      value={color}
                      type="submit"
                      style={{
                        backgroundColor: `${color}`,
                      }}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="accord-item">
         {ifSize && (
             <div className="accord-header">
               <h4 className="product-size">SIZE</h4>
               <FaAngleDown />
             </div>
         )}
            {ifSize && (
                <div className="accord-details">select menu</div>
            )}
         
        </div>
        <div className="accord-item">
          <div className="accord-header">
          <h4 className="product-details">Product Details</h4>
          <FaAngleDown />

          </div>
          <div className="accord-details">
          <p>Product Details: 8834941</p>
              <p>Return within "30 days". For detailed information, Click.</p>
              <p>Fabric Info: 100% BARKCLOTH</p>
          </div>
        </div>

        <div className="accordion__container">
          <div className="accordion__item">
            <div className="accordion__header"></div>
            <div className="accordion__details"></div>
            <div className="accordion__item">
              <div className="accordion__header"></div>
              <div className="accordion__details"></div>
            </div>
            <div className="accordion__item">
              <div className="accordion__header"></div>
              <div className="accordion__details"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDisplay;
