import React from "react";
import { Box, useTheme, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import FlexBetween from "components/FlexBetween";
import DataGridComponent from "components/DataGridComponent";

const Products = () => {
  const theme = useTheme();

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="PRODUCTS" subtitle="List of Products" />
        <Link to="/createProduct" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: theme.palette.background.table,
              color: "white",
              padding: ".5rem 1rem",
              ":hover": {
                backgroundColor: "orange",
              },
            }}
          >
            Create New Product
          </Button>
        </Link>
      </FlexBetween>
      <DataGridComponent type="products" />
      {/* <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: ".5px solid #F0F0F0",
            paddingTop: "10px",
            paddingBottom: "10px",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.table,
            color: theme.palette.secondary.main,
            borderBottom: "none",
          },
         
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.background.white,

            color:theme.palette.primary.textcolor
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "white",
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        {loading ? (
          <Loader />
        ) : error ? (
          <Message severity="error" error={error} />
        ) : items ? (
          
          <DataGrid
            getRowId={(row) => row._id}
            rows={items || []}
            columns={columns}
            rowsPerPageOptions={[5,10,20]}
            pageSize={pageSize}
            
        disableSelectionOnClick
          />
        ) : (
          []
        )}
      </Box> */}
    </Box>
  );
};

export default Products;
