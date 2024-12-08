import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSubCategories, listProducts } from "../actions/productActions";
import ProductFilter from "../components/ProductFilter";
import { AiOutlineClose } from "react-icons/ai";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import AppliedFilters from "../components/AppliedFilters";
import EmptyMessage from "../components/EmptyMessage";

const sortMenu = [
  { value: "priceLowToHigh", name: "Price: Low to High" },
  { value: "priceHighToLow", name: "Price: High to Low" },
  { value: "isFeatured", name: "Featured" }, // this is a boolean
  { value: "createdAt", name: "New Arrivals" },
];

const SubCategories = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const subCategoryId = location.pathname.split("/")[2];
  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
  } = useSelector((state) => state.product);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(""); // Selected Color
  const [minPrice, setMinPrice] = useState(""); // Minimum Price
  const [maxPrice, setMaxPrice] = useState(""); // Maximum Price
  const [selectedRating, setSelectedRating] = useState(null); // Selected Rating
  const [selectedSort, setSelectedSort] = useState(""); // Selected Sort Option
  const [filteredProducts, setFilteredProducts] = useState(products); // Filtered Products

  useEffect(() => {
    if (subCategoryId) {
      dispatch(listProducts("", subCategoryId));
    }
  }, [subCategoryId, dispatch]);
  useEffect(() => {
    if (products) {
      let uniqueColors = new Set();
      products.forEach((product) =>
        product.colors.forEach((color) => uniqueColors.add(color))
      );
      setColors([...uniqueColors]);
    }
  }, [products]);

  const handleSortChange = (event) => {
    const sortOption = event.target.value;
    console.log("Selected Sort Option:", sortOption); // Debugging
    setSelectedSort(sortOption); // Update the selected sort option
  };

  useEffect(() => {
    let results = products;

    if (selectedColor) {
      results = results.filter((product) =>
        product.colors.includes(selectedColor)
      );
    }
    if (minPrice && maxPrice) {
      results = results.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }
    if (selectedRating != null) {
      results = results.filter(
        (product) => product.ratingsAverage >= selectedRating
      );
    }

    // Now apply sorting if selectedSort is set
    if (selectedSort) {
      results = [...results]; // Create a shallow copy to prevent mutating state directly

      switch (selectedSort) {
        case "createdAt":
          // Ensure createdAt is treated as a date string
          results.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA; // Sort from newest to oldest
          });
          break;
        case "isFeatured":
          results.sort((a, b) => {
            return b.isFeatured === a.isFeatured ? 0 : b.isFeatured ? 1 : -1;
          });
          break;
        case "priceLowToHigh":
          results.sort((a, b) => {
            return parseFloat(a.price) - parseFloat(b.price); // Ensure prices are numbers
          });
          break;
        case "priceHighToLow":
          results.sort((a, b) => {
            return parseFloat(b.price) - parseFloat(a.price);
          });
          break;
        default:
          break;
      }
    }

    setFilteredProducts(results); // Update filtered products with applied filters and sorting

    // Debugging
    console.log("Filtered Products:", results);
  }, [
    products,
    selectedColor,
    minPrice,
    maxPrice,
    selectedRating,
    selectedSort,
  ]);

  const handleClearFilter = (type, id) => {
    if (type === "color") {
      setSelectedColor(""); // Clear color filter
    }

    if (type === "price") {
      setMinPrice("");
      setMaxPrice("");
    }
    if (type === "rating") {
      setSelectedRating(null);
    }
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setSelectedColor(""); // Clear color
    setMinPrice(""); // Clear min price
    setMaxPrice(""); // Clear max price
    setSelectedRating(null); // Clear rating
    setSelectedSort(""); // Clear sorting
  };

  return (
    <div className="page-container">
      <div className="products-list-wrapper">
        {products && products.length === 0 && (
          <EmptyMessage message="No Products to show..." />
        )}
        {products && products.length > 0 && (
          <>
            <div className="left">
              <ProductFilter
                showCategoryFilter={false}
                colors={colors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                setSelectedRating={setSelectedRating}
                setSelectedSort={setSelectedSort}
              />
            </div>
            <div className="right">
              <div className="first">
                <div className="select-wrapper">
                  <select
                    className="custom-select"
                    value={selectedSort}
                    onChange={handleSortChange}
                  >
                    <option value="">Sort By</option>
                    {sortMenu.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <AppliedFilters
                  selectedColor={selectedColor}
                  isCategoryPresent={false}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  selectedRating={selectedRating}
                  handleClearFilter={handleClearFilter}
                  handleClearAllFilters={handleClearAllFilters}
                />
              </div>
              {/* Loading or Error States */}
              {loadingProducts && <Loader />}
              {errorProducts && <Message error={errorProducts} />}

              <div className="products-list">
                {filteredProducts?.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubCategories;
