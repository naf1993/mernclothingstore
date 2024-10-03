import React, { useState } from "react";
import { Box, useTheme, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import FlexBetween from "components/FlexBetween";
import DataGridComponent from "components/DataGridComponent";
import CustomModal from "../components/CustomModal";
import CreateProduct from "components/CreateProduct";
import CustomModal1 from "components/CustomModal1";
const Products = () => {
  const theme = useTheme();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isNestedOpen,setIsNestedOpen] = useState(false)
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="PRODUCTS" subtitle="List of Products" />

        {/* <Button
          onClick={() => setIsOpenModal((show) => !show)}
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
        </Button> */}
        {/* {isOpenModal && (
          <CustomModal onClose={() => setIsOpenModal(false)}>
            <CreateProduct />
          </CustomModal>
        )} */}
        <CustomModal1>
          <CustomModal1.Open opens='create-product'>
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
          </CustomModal1.Open>
          <CustomModal1.Window name='create-product'>
            <CreateProduct/>
          </CustomModal1.Window>
        </CustomModal1>
      </FlexBetween>
      <DataGridComponent type="products" />
    </Box>
  );
};

export default Products;
