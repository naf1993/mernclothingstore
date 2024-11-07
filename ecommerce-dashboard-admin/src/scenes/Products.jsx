import React, { useState,useContext } from "react";
import { Box, useTheme, Button} from "@mui/material";

import Header from "../components/Header";
import FlexBetween from "components/FlexBetween";
import DataGridComponent from "components/DataGridComponent";
import { RiCoupon3Line } from "react-icons/ri";
import CreateProduct from "components/CreateProduct";
import CustomModal1 from "components/CustomModal1";
import toast from "react-hot-toast";
import AddCoupon from "components/ui/AddCoupon";
import { useSelector } from "react-redux";
import axios from 'axios'
import { ModalContext } from "components/CustomModal1";
const Products = () => {
  const [refreshData, setRefreshData] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [errorCoupon, setErrorCoupon] = useState(false);
  const { close } = useContext(ModalContext);


  const handleAddCoupon = async (code, discount) => {
    if (!userInfo?.token) {
      toast.error("No authentication token found.");
      return;
    }
    try {
      setLoadingCoupon(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/coupon",
        { code, discount },
        config
      );
      console.log(data.data.newCoupon); 
      setLoadingCoupon(false);
      setErrorCoupon(false); 
      close()
      toast.success('coupon added')
    } catch (error) {
      setLoadingCoupon(false);
      setErrorCoupon(true); 
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error creating coupon"
      );
    }
  };

  const theme = useTheme();
  return (
    <Box m="1.5rem 2.5rem">
      <CustomModal1>
        <CustomModal1.Open opens="create-coupon">
          <Button
            style={{
              color: "green",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <RiCoupon3Line style={{ fontSize: "1rem" }} />
            <span>Create Coupon</span>
          </Button>
        </CustomModal1.Open>
        <CustomModal1.Window name="create-coupon">
          <AddCoupon onAdd={handleAddCoupon} disabled={loadingCoupon}/>
          
        </CustomModal1.Window>
      </CustomModal1>
      <FlexBetween>
        <Header title="PRODUCTS" subtitle="List of Products" />

        <CustomModal1>
          <CustomModal1.Open opens="create-product">
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
          <CustomModal1.Window name="create-product">
            <CreateProduct
              onSuccess={() => {
                console.log("Refresh function called");
                setRefreshData((prev) => !prev); // This should toggle the state
              }}
            />
          </CustomModal1.Window>
        </CustomModal1>
      </FlexBetween>
      <DataGridComponent type="products" refresh={refreshData} />
    </Box>
  );
};

export default Products;
