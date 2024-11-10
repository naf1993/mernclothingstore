import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

import { useDispatch, useSelector } from "react-redux";
import { getSearchedProducts } from "../actions/productActions";
import Message from "./Message";
const ProductSearch = () => {
  const [searchText, setSearchText] = useState("");
  const history = useNavigate();
  const dispatch = useDispatch();
  const { searchedProducts, loading, error } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (searchText.length >= 3) {
      const debounceTimeout = setTimeout(() => {
        dispatch(getSearchedProducts(searchText));
      }, 300); // Debounce API call by 300ms
      return () => clearTimeout(debounceTimeout);
    } else {
      // Clear search results if search text is less than 3 characters or empty
      dispatch({ type: "CLEAR_SEARCHED_PRODUCTS" }); // Assuming you have a clear action for redux
    }
  }, [searchText,dispatch]);
  const handleItemClick = (productId) => {
    history(`/products/${productId}`);
    setSearchText('')
  };
  return (
    <div className="searchbox-wrapper">
      <input
        type="text"
        value={searchText}
        className="search__input"
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search for Abaya, Hijabs"
      />
      <button className="search__button">
        <BsSearch className="search__icon" />
      </button>
      {searchText.length >= 3 &&
        searchedProducts &&
        searchedProducts.length > 0 && (
          <div className="search-dropdown">
            {loading && <p>loading products</p>}
            {error && <Message error={error} />}
            {searchedProducts.map((product) => (
              <div
                key={product.id}
                className="search-item"
                onClick={() => handleItemClick(product.id)}
              >
                <span>{product.name }</span> in <span>{ product.Category?.name}</span>
              </div>
            ))}
          </div>
        )}

      {searchText.length >= 3 &&
        searchedProducts &&
        searchedProducts.length === 0 && (
          <div className="search-dropdown">
            <p>No products found</p>
          </div>
        )}
    </div>
  );
};

export default ProductSearch;
