import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FlexBetween from "../components/FlexBetween";
import Header from "components/Header";
import TotalSalesBarChart from "components/TotalSalesBarChart";
import NewProductsCard from "components/NewProductsCard";
import axios from "axios";
import { BsCurrencyDollar } from "react-icons/bs";
import { BsFillPeopleFill, BsCart4, BsFillBagHeartFill } from "react-icons/bs";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
  Message,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  CardHeader,
  Card,
} from "@mui/material";
import StatBox from "../components/StatBox";
import { getDashboardStats } from "../actions/dashboardActions";

import Chart from "react-apexcharts";
import { breakpoints } from "@mui/system";

const Dashboard = () => {
  const dispatch = useDispatch();
  const dashboardStats = useSelector((state) => state.dashboardStats);
  const { summary } = dashboardStats;

  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 800px)");

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Dashboard" subtitle="Welcome to your Dashboard" />
        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>
      <Box
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
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
          <Grid item xs={12} md={8}>
            <TotalSalesBarChart />
          </Grid>
          <Grid item xs={12} md={4}>
            <NewProductsCard />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
