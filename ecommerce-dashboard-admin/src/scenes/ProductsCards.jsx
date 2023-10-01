import React, { useEffect, useMemo, useState, useRef } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import Header from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader/Loader";
import Message from "../components/Message";

import { listProducts } from "../actions/productActions";
import Product from "components/Product";

import ClearIcon from "@mui/icons-material/Clear";

import FlexBetween from "../components/FlexBetween";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Select } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import "./products.css";
import axios from "axios";

const SearchBar = ({ setSearchQuery }) => (
  <form>
    <TextField
      variant="standard"
      id="search-bar"
      className="text"
      required
      fullWidth
      sx={{ backgroundColor: "white", padding: "6px 15px" }}
      onInput={(e) => {
        setSearchQuery(e.target.value);
      }}
      placeholder="Search Product"
      size="small"
      InputProps={{
        endAdornment: <SearchIcon />, // <== adjusted this
        disableUnderline: true, // <== added this
      }}
    />
  </form>
);

const ProductsCards = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const [searchQuery, setSearchQuery] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [category, setCategory] = useState("");
  const action = useRef(null);
  const [selectOptions, setSelectOptions] = useState([]);
  const [sortFeatures, setSortFeatures] = useState("");
 
  const handleClearClick = () => {
    setCategory("");
  };
  const handleClearSort = ()=>{
    setSortFeatures('')
  }

 

  const allproducts = useMemo(() => {
    if (category === "") {
      if(sortFeatures === ''){

      
      if (searchQuery === "") {
        return products;
      } else {
        return products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery)
        );
      }
    }else{
    
    
      if(sortFeatures === 'priceAscending'){
       return products.sort((a,b)=>{
        return a.price - b.price
       })  
      }
      else if(sortFeatures === 'priceDesceding'){
        return products.sort((a,b)=>{
          return b.price - a.price
         })  
      }
      else if(sortFeatures === 'ratingHigh'){
        return products.sort((a,b)=>{
          return b.ratingsAverage - a.ratingsAverage
        })
      }
      else if(sortFeatures === 'featured'){
        return products.filter((product)=>product.isFeatured)
      }
      else if(sortFeatures === 'new'){
        return products.sort((a,b)=>{
          return new Date(b.createdAt) - new Date(a.createdAt)
        })
      }
      else return products
    }
    } else {
      console.log(category);
      return products.filter(
        (product) =>
          product.Category.name.toLowerCase() === category.toLowerCase()
      );
    }
  }, [category, searchQuery, products,sortFeatures]);
  useEffect(() => {
    dispatch(listProducts());

    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${userInfo.token}`,
    //   },
    // };
    async function fetchCategories() {
      const { data } = await axios.get(
        "http://localhost:5000/api/categories"
      );

      const categories = data.data.categories;

      const resultOptions = [];
      categories.forEach((category) => {
        resultOptions.push({
          value: category.name,
          key: category.id,
        });
      });
      setSelectOptions([...resultOptions]);
    }
    fetchCategories();
    if (searchQuery !== "") {
      setCategory("");
      setSortFeatures('')
    }
  }, [dispatch, searchQuery]);
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="PRODUCTS" subtitle="" />
        <FlexBetween gap="1rem">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <FlexBetween gap=".2rem">
            <FormControl
              variant="outlined"
              sx={{ m: 1, minWidth: 120 }}
              size="small"
            >
              <InputLabel>Category</InputLabel>
              <Select
                action={action}
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                sx={{
                  backgroundColor: "white",
                  "& .MuiSelect-iconOutlined": {
                    display: category ? "none" : "",
                  },
                  "&.Mui-focused .MuiIconButton-root": { color: "grey" },
                  boxShadow: "none",
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                  "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      border: 0,
                    },
                  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: 0,
                    },
                }}
                renderValue={(value) =>
                  value ? value : <em>Nothing Selected</em>
                }
                endAdornment={
                  <IconButton
                    sx={{ visibility: category ? "visible" : "hidden" }}
                    onClick={handleClearClick}
                  >
                    <ClearIcon />
                  </IconButton>
                }
              >
                {selectOptions.map((option) => {
                  return (
                    <MenuItem key={option.key} value={option.value}>
                      {option.value}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </FlexBetween>
          <FlexBetween gap="0.01rem">
            <FormControl
              variant="outlined"
              sx={{ m: 1, minWidth: 120 }}
              size="small"
            >
              <InputLabel>Sort</InputLabel>
              <Select
               sx={{
                backgroundColor: "white",
                "& .MuiSelect-iconOutlined": {
                  display: sortFeatures ? "none" : "",
                },
                "&.Mui-focused .MuiIconButton-root": { color: "grey" },
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
              }}
             
              endAdornment={
                <IconButton
                  sx={{ visibility: sortFeatures ? "visible" : "hidden" }}
                  onClick={handleClearSort}
                >
                  <ClearIcon />
                </IconButton>
              }
                value={sortFeatures}
                onChange={(e) => {
                  setSortFeatures(e.target.value)
                 
                }}
              >
                <MenuItem value="priceAscending">Price:low to high</MenuItem>
                <MenuItem value="priceDesceding">Price:high to low</MenuItem>
                <MenuItem value="ratingHigh">Popularity</MenuItem>
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="new">New Arrivals</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message severity="error" error={error} />
      ) : (
        <Box
          mt="26px"
          display="grid"
          rowGap={2}
          columnGap={2}
          gridTemplateColumns="repeat(auto-fit, minmax(13rem, 1fr))"
        >
          {allproducts?.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductsCards;
