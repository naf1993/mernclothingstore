import React, { useState } from "react";
import StarRating from "./StarRating";

const prices = [
  { id: 0, name: "$100 to $400", array: [100, 400] },
  { id: 1, name: "$400 to $800", array: [400, 800] },
  { id: 2, name: "$800 to $1500", array: [800, 1500] },
  { id: 3, name: "$1500 to $2000", array: [1500, 2000] },
  { id: 4, name: "$2000 or more", array: [2000, 9999] },
];

const ratings = [
  { name: "4 stars & up", rating: 4 },
  { name: "3 stars & up", rating: 3 },
  { name: "2 stars & up", rating: 2 },
  { name: "1 star & up", rating: 1 },
];

const ProductFilter = ({
  colors,
  options,
  setSelectedIds,
  setSelectedColor,
  setMinPrice,
  setMaxPrice,
  selectedColor,
  setSelectedRating,showCategoryFilter=true
 
}) => {
  const handleSubcategoryChange = (e) => {
    const id = e.target.name;
    const checked = e.target.checked;

    // Update selected subcategories state
    setSelectedIds((prev) => {
      const newSelectedIds = new Set(prev);
      if (checked) newSelectedIds.add(id);
      else newSelectedIds.delete(id);
      return newSelectedIds;
    });
  };

  const handleColorChange = (color) => {
    console.log(color);
    setSelectedColor(color);
  };

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split(",");
    setMinPrice(parseInt(min, 10));
    setMaxPrice(parseInt(max, 10));
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  return (
    <>
      {/* Filter By Category */}
      {showCategoryFilter && (
          <div className="filter-1">
          <h6 className="filter-name">Filter By Category</h6>
          <div
            className="checkbox-wrapper1"
            style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}
          >
            {" "}
            {options.map((item, index) => (
              <div key={index}>
                {" "}
                <label>
                  {" "}
                  <input
                    name={item.id}
                    value={item.name}
                    checked={item.checked}
                    type="checkbox"
                    onChange={handleSubcategoryChange}
                  />{" "}
                  <span>{item.name}</span>{" "}
                </label>{" "}
              </div>
            ))}{" "}
          </div>
        </div>
      )}
    

      {/* Filter By Price */}
      <div className="filter-2">
        <h6 className="filter-name">Filter By Price</h6>
        {prices.map((item) => (
          <div key={item.id} className="radio">
            <input
              type="radio"
              id={`price-${item.id}`}
              name="priceRange"
              value={item.array}
              onChange={handlePriceChange} // Handle price selection
              className="inputR"
            />
            <label htmlFor={`price-${item.id}`} className="labelR">
              <span className="rButton"></span>
              {item.name}
            </label>
          </div>
        ))}
      </div>

      {/* Filter By Color */}
      <div className="filter-3">
        <h6 className="filter-name">Filter By Color</h6>
        <div className="buttons-wrapper">
          {colors?.map((color, index) => (
            <span key={index} className="filter-color-btn">
              <button
                value={color}
                type="submit"
                onClick={() => handleColorChange(color)}
                style={{
                  backgroundColor: `${color}`,
                  outline: selectedColor === color ? `2px solid ${color}` : 'none',
                  outlineOffset: '3.4px' // Optional, to space the outline from the button
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Filter By Customer Review */}
      <div className="filter-4">
        <h6 className="filter-name">Customer Review</h6>
        <div className="rating-filter">
          {ratings.map((item) => (
            <div key={item.rating}>
              <input
                type="radio"
                id={`rating-${item.rating}`}
                name="rating"
                value={item.rating}
                onChange={() => handleRatingChange(item.rating)} // Update selected rating
                className="inputR"
              />
              <label htmlFor={`rating-${item.rating}`} className="labelR">
                {/* Custom radio button */}
                <span className="rButton"></span>
                <StarRating rating={item.rating} /> {/* Display star rating */}
                <span>{item.name}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductFilter;
