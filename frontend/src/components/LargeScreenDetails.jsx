import React from 'react'
import Select from "react-select";

const LargeScreenDetails = ({onSizeChange,sizeOptions,colors,onHandleColor,ifSize}) => {
  return (
   <>
    {colors && <h4 className="product-color">COLORS</h4>}
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
                 {ifSize && <h4 className="product-size">SIZE</h4>}
                {ifSize && (
                  <Select
                    isClearable={true}
                    options={sizeOptions}
                    defaultValue={{ label: "Select Size", value: 0 }}
                    onChange={onSizeChange}
                  />
                )}
                 <h4 className="product-details">Product Details</h4>
               <p>Product Details: 8834941</p>
               <p>Return within "30 days". For detailed information, Click.</p>
               <p>Fabric Info: 100% BARKCLOTH</p>

   </>
  )
}

export default LargeScreenDetails