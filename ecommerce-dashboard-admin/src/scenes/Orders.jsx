import React, { useState } from "react";
import { Box, useTheme, Button, Typography } from "@mui/material";

import Header from "../components/Header";
import FlexBetween from "components/FlexBetween";
import DataGridComponent from "components/DataGridComponent";

const Orders = () => {
  const [refreshData, setRefreshData] = useState(false);

  const theme = useTheme();
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Orders" subtitle="List of Orders" />
      </FlexBetween>
      <DataGridComponent type="orders" />
    </Box>
  );
};

export default Orders;
