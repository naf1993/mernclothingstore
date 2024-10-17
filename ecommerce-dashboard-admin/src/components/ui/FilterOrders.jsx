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
    startDate: new Date("2024-01-01"),
    endDate: new Date(Date.now()),
  });
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    applyFilterAndSort();
  }, [searchOrder, dateRange.startDate, dateRange.endDate, sortOption]);

  const applyFilterAndSort = () => {
    let filteredItems = items.filter((item) => {
      const matchesSearch = item.orderId
        .toLowerCase()
        .includes(searchOrder.toLowerCase());
      let itemDate = new Date(item.saleDate);
      const matchesDates =
        itemDate >= dateRange.startDate && itemDate <= dateRange.endDate;
      return matchesSearch && matchesDates;
    });
    return filteredItems;
  };
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearchOrder(e.target.value);
  };

  return (
    <Box sx={{ width: "100%", marginTop: "1rem" }}>
      <Grid
        container
        rowGap={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={12} sm={2}>
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
            placeholder="Search Order"
            size="small"
            InputProps={{
              endAdornment: <AiOutlineSearch />, // <== adjusted this
              disableUnderline: true, // <== added this
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DateRangePicker
            onDateChange={(start, end) => {
              setDateRange({ startDate: start, endDate: end });
            }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
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
              <MenuItem value="totalPrice">Order Amount</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Button
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
