import React, { useEffect } from "react";
import Select from "react-select";

const LargeScreenDetails = ({
  onSizeChange,
  sizeOptions,
  colors,
  onHandleColor,
  ifSize,
  setColorErr,
  setSizeErr,
  colorErr,
  sizeErr,
  description
}) => {


  return (
    <>
    
      {colors && <h4 className="product-color color-name">COLORS</h4>}
      {colors && (
        <div className="buttons-wrapper">
          {colors.map((color) => (
            <span key={color} className="filter-color-btn">
              <button
                value={color}
                type="button" // Change to button to avoid form submission
                onClick={() => onHandleColor(color)}
                style={{
                  backgroundColor: color,
                }}
              />
            </span>
          ))}
        </div>
      )}

      {colorErr && <p className="text-danger">{colorErr}</p>}
      
      {ifSize && <h4 className="product-size size-name">SIZE</h4>}
      {ifSize && (
        <Select
          isClearable={true}
          options={sizeOptions}
          onChange={onSizeChange}
        />
      )}
      {sizeErr && <p className="text-danger">{sizeErr}</p>}

      <h4 className="product-details detail-name">Product Details</h4>
      <p className="details">{description}</p>
      <p>Fabric Info : Pure Cotton</p>
    
    </>
  );
};

export default LargeScreenDetails;
