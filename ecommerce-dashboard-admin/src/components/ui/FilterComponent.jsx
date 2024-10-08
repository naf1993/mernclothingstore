import React, { useEffect, useState } from "react";
import {
  Select,
  MenuItem,
  TextField,
  Box,
  InputLabel,
  FormControl,
  Button,
  useTheme,
} from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import FlexBetween from "components/FlexBetween";
import Grid from "@mui/system/Unstable_Grid/Grid";
const FilterComponent = ({ items, onFilterChange }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(items.map((item) => item.Category?.name))
    ).filter(Boolean);
    setCategories(uniqueCategories);
   
  }, [items]);

  useEffect(() => {
    const uniqueSubcategories = selectedCategory
      ? Array.from(
          new Set(
            items
              .filter((item) => item.Category?.name === selectedCategory)
              .map((item) => item.SubCategory?.name)
          )
        ).filter(Boolean)
      : [];
    setSubcategories(uniqueSubcategories);
  
  }, [selectedCategory, items]);
  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm, selectedCategory, selectedSubcategory, sortOption]); // Trigger on any filter or sort change

  const applyFiltersAndSort = () => {
    let filteredItems = items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? item.Category?.name === selectedCategory
        : true;
      const matchesSubcategory = selectedSubcategory
        ? item.SubCategory?.name === selectedSubcategory
        : true;

      return matchesSearch && matchesCategory && matchesSubcategory;
    });

    // Sorting logic
    if (sortOption) {
      filteredItems.sort((a, b) => {
        switch (sortOption) {
          case "createdDate":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "isFeatured":
            return b.isFeatured === a.isFeatured ? 0 : b.isFeatured ? 1 : -1;
          case "priceLowToHigh":
            return a.price - b.price;
          case "priceHighToLow":
            return b.price - a.price;
          default:
            return 0;
        }
      });
    }

    onFilterChange(filteredItems);
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchTerm]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory("");
    applyFiltersAndSort();
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
    applyFiltersAndSort();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    applyFiltersAndSort();
  };
  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSortOption("");
    onFilterChange(items);
  };

  return (
    <Box sx={{ width: "100%",marginTop:'1rem'}}>
      <Grid container rowGap={1}  justifyContent='space-between' alignItems="center">
        <Grid item xs={12} sm={2}>
          
          <TextField
            fullWidth
            variant="standard"
            id="search-bar"
            className="text"
            value={searchTerm}
            sx={{ color:theme.palette.primary.textcolor,backgroundColor: "white",borderRadius:'5px',padding:'6px 8px',display:'flex',alignItems:'center',justifyContent:'flex-start' }}
            onChange={handleSearchChange}
            placeholder="Search Product"
            size="small"
            InputProps={{
              endAdornment: <AiOutlineSearch />, // <== adjusted this
              disableUnderline: true, // <== added this
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ m: 1, minWidth: 120 }}
            size="small"
          >
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              sx={{
                backgroundColor: "white",
                "& .MuiSelect-iconOutlined": {
                  display: selectedCategory ? "none" : "",
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
              onChange={handleCategoryChange}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ m: 1, minWidth: 120 }}
            size="small"
          >
            <InputLabel>Subcategory</InputLabel>
            <Select
              sx={{
                backgroundColor: "white",
                "& .MuiSelect-iconOutlined": {
                  display: selectedSubcategory ? "none" : "",
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
              value={selectedSubcategory}
              onChange={handleSubcategoryChange}
              disabled={!selectedCategory}
            >
              <MenuItem value="">
                <em>All Subcategories</em>
              </MenuItem>
              {subcategories.map((subcategory) => (
                <MenuItem key={subcategory} value={subcategory}>
                  {subcategory}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ m: 1, minWidth: 120 }}
            size="small"
          >
            <InputLabel>Sort By</InputLabel>
            <Select
              sx={{
                backgroundColor: "white",
                "& .MuiSelect-iconOutlined": {
                  display: sortOption ? "none" : "",
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
              value={sortOption}
              onChange={handleSortChange}
            >
              <MenuItem value="">
                <em>Default</em>
              </MenuItem>
              <MenuItem value="createdDate">Created Date</MenuItem>
              <MenuItem value="isFeatured">Featured</MenuItem>
              <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
              <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClearAll}
            sx={{
              backgroundColor: theme.palette.green[400],
              color: theme.palette.primary.main,
            }}
          >
            Clear All
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterComponent;
