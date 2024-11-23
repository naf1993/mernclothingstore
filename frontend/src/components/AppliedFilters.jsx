import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const AppliedFilters = ({
  selectedColor,
  selectedIds,
  options,
  minPrice,
  maxPrice,
  selectedRating,
  handleClearFilter,
  handleClearAllFilters
}) => {
  return (
    <div className="applied-filters">
      {selectedColor && (
        <button className="filter-chip">
          <span>Color: {selectedColor}</span>
          <AiOutlineClose onClick={() => handleClearFilter("color")} />
        </button>
      )}
      {selectedIds.size > 0 &&
        [...selectedIds].map((id) => {
          const subcategory = options.find((option) => option.id === id);
          return (
            <button className="filter-chip" key={id}>
              <span>Category: {subcategory?.name}</span>
              <AiOutlineClose onClick={() => handleClearFilter("category", id)} />
            </button>
          );
        })}
      {minPrice && maxPrice && (
        <button className="filter-chip">
          <span>
            Price: ${minPrice} - ${maxPrice}
          </span>
          <AiOutlineClose onClick={() => handleClearFilter("price")} />
        </button>
      )}
      {selectedRating && (
        <button className="filter-chip">
          <span>Rating: {selectedRating}</span>
          <AiOutlineClose onClick={() => handleClearFilter("rating")} />
        </button>
      )}
      {(selectedColor || selectedIds.size > 0 || minPrice || maxPrice || selectedRating) && (
        <button onClick={handleClearAllFilters} className="clear-filters-btn">
          Clear All
        </button>
      )}
    </div>
  );
};

export default AppliedFilters;
