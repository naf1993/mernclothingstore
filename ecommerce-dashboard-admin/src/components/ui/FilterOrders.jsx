import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  TextField,
  Box,
  InputLabel,
  FormControl,
  Button,
  useTheme,
  Grid,
} from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import DateRangePicker from "./DateRangePicker";

const FilterOrders = ({ items, onFilterChange }) => {
  const theme = useTheme();
  const [searchOrder, setSearchOrder] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date("2024-01-01T00:00:00"),
    endDate: new Date(Date.now()),
  });
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    applyFilterAndSort();
  }, [searchOrder, dateRange.startDate, dateRange.endDate, sortOption]);

  const applyFilterAndSort = () => {
    let filteredItems = items.filter((item) => {
      const searchLower = searchOrder.toLowerCase();
      const matchesSearch =
        item.orderId.toLowerCase().includes(searchLower) ||
        item.user.name.toLowerCase().includes(searchLower);
      let itemDate = new Date(item.saleDate);
      const matchesDates =
        itemDate >= dateRange.startDate && itemDate <= dateRange.endDate;
      return matchesSearch && matchesDates;
    });

    if (sortOption) {
      filteredItems.sort((a, b) => {
        switch (sortOption) {
          case "saleDate":
            return new Date(a.saleDate) - new Date(b.saleDate);
          case "priceAscending":
            return a.totalPrice - b.totalPrice;
          case "priceDescending":
            return b.totalPrice - a.totalPrice;
          default:
            return 0;
        }
      });
    }

    onFilterChange(filteredItems);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchOrder(e.target.value);
  };

  const handleClearAll = () => {
    setSearchOrder("");
    setDateRange({
      startDate: new Date("2024-01-01"),
      endDate: new Date(Date.now()),
    });
    setSortOption("");
    onFilterChange(items);
  };

  return (
    <Box sx={{ width: "100%", marginTop: "1rem" }}>
      <Grid
        container
        spacing={2}
        rowGap={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            fullWidth
            variant="standard"
            id="search-bar"
            className="text"
            value={searchOrder}
            sx={{
              color: theme.palette.primary.textcolor,
              backgroundColor: "white",
              borderRadius: "5px",
              padding: "6px 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
            onChange={handleSearchChange}
            placeholder="Search by Order or Name"
            size="medium"
            InputProps={{
              endAdornment: <AiOutlineSearch />,
              disableUnderline: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={(start, end) => {
              setDateRange({ startDate: start, endDate: end });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
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
              <MenuItem value="saleDate">Order Date</MenuItem>
              <MenuItem value="priceAscending">Amount Low to High</MenuItem>
              <MenuItem value="priceDescending">Amount High to Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            onClick={handleClearAll}
            fullWidth
            variant="outlined"
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

export default FilterOrders;
