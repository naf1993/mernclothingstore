import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import NewProductsCard from "components/NewProductsCard";
import axios from "axios";
import { BsCurrencyDollar } from "react-icons/bs";
import { BsFillPeopleFill, BsCart4, BsFillBagHeartFill } from "react-icons/bs";

import { Box, useTheme, useMediaQuery, Grid } from "@mui/material";
import StatBox from "../components/StatBox";
import { getDashboardStats } from "../actions/dashboardActions";
import DateRangePicker from "components/ui/DateRangePicker";

import TotalSalesData from "components/TotalSalesData";
import Message from "components/Message";
import Loader from "components/loader/Loader";
import TopProductsChart from "components/ui/TopProductsChart";
import CustomTable from "components/ui/CustomTable";
import { getAllOrders } from "actions/orderActions";
const Dashboard = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const {
    loading,
    error,
    items: products,
  } = useSelector((state) => state.productList);
  const {
    loading: loadingOrders,
    error: errorOrders,
    items,
  } = useSelector((state) => state.order);

  const { userInfo } = userLogin;
  const [salesData, setSalesData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date("2024-01-01"),
    endDate: new Date(Date.now()),
  });
  const [loadingSales, setLoadingSales] = useState(false);
  const [errorSales, setErrorSales] = useState(false);

  const [topProducts, setTopProducts] = useState([]);
  const [loadingTopProducts, setLoadingTopProducts] = useState(false);
  const [errorTopProducts, setErrorTopProducts] = useState(false);
  const dashboardStats = useSelector((state) => state.dashboardStats);
  const { summary } = dashboardStats;
  const isNonMediumScreens = useMediaQuery("(min-width: 800px)");

  const newProducts = products
    ?.filter((item) => item.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5); //getting latest 10 products
  console.log(newProducts);

  const newOrders = items
    ?.filter((order) => order.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 7);
  console.log("these are new orders", newOrders);

  const orderTableData = newOrders?.map((order) => ({
    name: order.address.fullName,
    totalPrice: order.totalPrice,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
  }));
  console.log("Items from Redux:", items); // Log all orders
  console.log("New Orders:", newOrders);
  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  //   useEffect(()=>{
  // dispatch(getAllOrders())
  //   },[dispatch])

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${userInfo.token}`, // Add authorization token
    },
  };
  useEffect(() => {
    const getTopProducts = async () => {
      setLoadingTopProducts(true);
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/products/top-selling",
          config
        );
        console.log(data);
        setTopProducts(data);
      } catch (error) {
        setErrorTopProducts(error);
        toast.error("Failed to fetch top products");
      } finally {
        setLoadingTopProducts(false);
      }
    };
    getTopProducts();
  }, []);

  useEffect(() => {
    const getSales = async () => {
      const { startDate, endDate } = dateRange; // Destructure startDate and endDate
      if (!startDate || !endDate) return; // Prevent API call if dates are not selected
      setLoadingSales(true);
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
          config
        );
        console.log(data);
        setSalesData(data);
      } catch (err) {
        setErrorSales(err);
        toast.error("Failed to fetch sales data.");
      } finally {
        setLoadingSales(false);
      }
    };
    getSales();
  }, [dateRange]); //

  const handleRowClick = (id) => {
    console.log("navigating");
  };

  return (
    <Box m="1rem 2rem">
      <Box
        sx={{
          "& > div": {
            gridColumn: isNonMediumScreens ? undefined : "span 12",
          },
        }}
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12,1fr)"
        gridAutoRows="160px"
        gap="20px"
      >
        <StatBox
          title="Revenue"
          value={summary && summary.revenue}
          increase="+14%"
          description="Since last month"
          color="#D14341"
          icon={BsCurrencyDollar}
        />
        <StatBox
          title="Total Customers"
          value={summary && summary.noOfUsers}
          increase="+20%"
          color="#14B8A6"
          description="Since last month"
          icon={BsFillPeopleFill}
        />

        <StatBox
          title="Total Orders"
          value={summary && summary.noOfOrders}
          increase="+30%"
          color="#5048E5"
          description="Since last month"
          icon={BsCart4}
        />
        <StatBox
          title="Products Sold"
          value={summary && summary.productsSold}
          increase="+5%"
          color="#FFB020"
          description="Since last month"
          icon={BsFillBagHeartFill}
        />
      </Box>

      <Grid item xs={12} sx={{ marginTop: "1.7rem" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box>
              {loadingSales && <Loader />}
              {errorSales && <Message error={errorSales} />}
              {salesData.length > 0 && <TotalSalesData data={salesData} />}
             <Box sx={{width:'20rem',margin:'0 auto',marginTop:'0.8rem'}}>
             <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={(start, end) => {
              setDateRange({ startDate: start, endDate: end });
            }}
          />
             </Box>
            
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            {loadingTopProducts && <Loader />}
            {errorTopProducts && <Message error={errorTopProducts} />}
            {topProducts.length > 0 && <TopProductsChart data={topProducts} />}
          </Grid>
        </Grid>
      </Grid>

      <Grid container sx={{ marginTop: "1rem" }} spacing={3}>
        <Grid item xs={12} md={6}>
          {loadingTopProducts && <Loader />}
          {errorTopProducts && <Message error={errorTopProducts} />}
          {newProducts && newProducts.length > 0 && (
            <CustomTable
              data={newProducts}
              onRowClick={handleRowClick}
              columns={[
                {
                  id: "image",
                  label: "Image",
                  render: (item) => (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                      }}
                    />
                  ),
                },
                { id: "name", label: "Product Name" },
                { id: "price", label: "Price" },
              ]}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {loadingOrders && <Loader />}
          {errorOrders && <Message error={errorOrders} />}
          {orderTableData && orderTableData.length > 0 && (
            <CustomTable
              data={orderTableData}
              columns={[
                { id: "name", label: "Ordered By" },
                { id: "totalPrice", label: "Total price" },
                { id: "paymentStatus", label: "Payment" },
                { id: "orderStatus", label: "Order Status" },
              ]}
              onRowClick={handleRowClick}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
