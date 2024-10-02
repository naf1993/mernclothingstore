import React, { useEffect, useState } from "react";
import { Box, useTheme,Typography } from "@mui/material";
import Header from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader/Loader";
import Message from "../components/Message";
import { listProducts } from "../actions/productActions";
import Product from "components/Product";
import FlexBetween from "../components/FlexBetween";
import FilterComponent from "components/ui/FilterComponent";
import "./products.css";

const ProductsCards = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, items } = productList;
  const [filteredProducts, setFilteredProducts] = useState(items);
  const [noResults, setNoResults] = useState(false);
  const handleFilterChange = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
    setNoResults(filteredProducts.length === 0);
  };

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  useEffect(() => {
    setFilteredProducts(items); // Update filteredProducts whenever items change
  }, [items]);
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="PRODUCTS" subtitle="" />
      </FlexBetween>
      <FilterComponent items={items} onFilterChange={handleFilterChange} />

      {loading ? (
        <Loader />
      ) : error ? (
        <Message severity="error" error={error} />
      ) : filteredProducts.length > 0 ? (
        <Box
          mt="26px"
          display="grid"
          rowGap={2}
          columnGap={2}
          gridTemplateColumns="repeat(auto-fit, minmax(13rem, 1fr))"
        >
          {filteredProducts?.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </Box>
      ) : (
        noResults && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography variant="h6" color="error">
              No results found
            </Typography>
          </Box>
        )
      )}
    </Box>
  );
};

export default ProductsCards;
