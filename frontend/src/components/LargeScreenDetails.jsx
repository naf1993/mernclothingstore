import React, { useEffect } from "react";
import Select from "react-select";

const LargeScreenDetails = ({
  onSizeChange,
  sizeOptions,
  colors,
  onHandleColor,
  ifSize,
  setColorErr,setSizeErr,colorErr,sizeErr
}) => {
  useEffect(() => {
    console.log("large  view rendered");
    console.log(colors)
  }, []);
  return (
    <>
      {colors && <h4 className="product-color color-name">COLORS</h4>}
      {colors && (
        <div className="buttons-wrapper">
          {colors?.map((color, index) => (
            <span key={index} className="filter-color-btn">
              <button
                value={color}
                type="submit"
                onClick={() => onHandleColor(color)}
                style={{
                  backgroundColor: `${color}`,
                }}
              />
            </span>
          ))}
        </div>
      )}

      {colorErr ? <p className="text-danger">{colorErr}</p> : null}

     
      {ifSize && <h4 className="product-size size-name">SIZE</h4>}
      {ifSize && (
        <Select
          isClearable={true}
          options={sizeOptions}
          defaultValue={{ label: "Select Size", value: 0 }}
          onChange={onSizeChange}
        />
      )}
      {sizeErr ? <p className="text-danger">{sizeErr}</p>:null}

<h4 className="product-details detail-name">Product Details</h4>
      <p>Product Details: 8834941</p>
      <p>Return within "30 days". For detailed information, Click.</p>
      <p>Fabric Info: 100% BARKCLOTH</p>
    </>
  );
};

export default LargeScreenDetails;
