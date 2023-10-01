import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import axios from 'axios'
import { useSelector } from "react-redux";
import { Grid, MenuItem, TextField, Typography } from "@mui/material";

// third-party
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
import MainCard from "./ui/MainCard";

const status = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "year",
    label: "This Year",
  },
];

const TotalSalesBarChart = () => {
  const theme = useTheme();
  const [value, setValue] = useState("today");
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const [dates, setDates] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartData2,setChartData2] = useState([])
  // const primary400 = theme.palette.blue[400]
  // const secondary400 = theme.palette.purple[400]
  // const warning400 = theme.palette.warning[400]
  // const error400 = theme.palette.error[400]
  useEffect(() => {
    const options1 = [];
    const series1 = [];
    const series2 = []

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token} `,
      },
    };
    const fetchDailyOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders/getdailyorders", config);
        data.data.dailyOrders.map((item) => {
          options1.push(item._id);
          series1.push(item.sales);
          series2.push(item.orders)
        });
        setDates(options1);
        setChartData(series1);
        setChartData2(series2)
      } catch (error) {
        console.log(error);
      }

     console.log(series2)
    };

    fetchDailyOrders();
  }, []);
  return (
    <>
      <MainCard>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Grid container direction="column" spacing="1">
                  <Grid item>
                    <Typography variant="subtitle2">Total Growth</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h3">$2,324.00</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <TextField
                  id="standard-select-currency"
                  select
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                >
                  {status.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Chart
              options={{
                chart: {
                  id: "bar-chart",
                  stacked: true,
                  toolbar: {
                    show: true,
                  },
                  zoom: {
                    enabled: true,
                  },
                },
                responsive: [
                  {
                    breakpoint: 480,
                    legend: {
                      position: "bottom",
                      offsetX: -10,
                      offsetY: 0,
                    },
                  },
                ],
                plotOptions: {
                  bar: {
                    horizontal: false,
                    columnWidth: "20%",
                  },
                },
             
                xaxis: {
                   
                  type: "category",
                  categories: dates
                },
                legend: {
                  show: true,
                  fontSize: "14px",
                  fontFamily: `'Roboto', sans-serif`,
                  position: "bottom",
                  offsetX: 20,
                  labels: {
                    useSeriesColors: false,
                  },
                  markers: {
                    width: 16,
                    height: 16,
                    radius: 5,
                  },
                  itemMargin: {
                    horizontal: 15,
                    vertical: 8,
                  },
                },
                fill: {
                    type: 'solid'
                  },
                  dataLabels: {
                    enabled: false
                  },
                  grid: {
                    show: true,
                  
                  },
                  

              }}
              series={[
                {
                    name: "sales",
                    data: chartData,
                  },
                  {
                    name:'orders',
                    data:chartData2
                  }
              ]}
              type="bar"
              height='380'
             
            />
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

export default TotalSalesBarChart;
