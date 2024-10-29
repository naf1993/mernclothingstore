import React, { useState, useContext } from "react";
import { Box, Button, useTheme, TextField } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CustomModal1 from "./CustomModal1"; // For default export
import { ModalContext } from "./CustomModal1"; // For named export
import { listProducts } from "actions/productActions";

const BulkActions = ({ type, selectionModel, onAction }) => {
  const theme = useTheme();
  const [incrementBy, setIncrementBy] = useState(null);
  const userLogin = useSelector((state) => state.userLogin);
  const dispatch = useDispatch()
  const { userInfo } = userLogin;
  const { close, open: openModal } = useContext(ModalContext);

  console.log("Modal Context:", { close });

  // Log selectionModel to ensure it's correctly passed
  console.log("Selection Model:", selectionModel);

  const handleGenerateInvoices = async (selectionModel) => {
    const orderIdsQuery = selectionModel.join(",");
    const apiUrl = `/generate-invoice?orderIds=${orderIdsQuery}`;

    try {
      const token = userInfo?.token;
      console.log("this is token", token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      };

      const response = await axios.get(
        `http://localhost:5000/api/orders${apiUrl}`,
        config
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "invoices.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Error downloading invoice: " + error.message);
    }
  };

  const handleUpdateStock = async (selectionModel, incrementBy) => {
    const productIds = selectionModel;
    const apiUrl = "/bulk-update-stock";

    try {
      const token = userInfo?.token;
      console.log("this is token", token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { incrementBy },
      };

      await axios.post(
        `http://localhost:5000/api/products${apiUrl}`,
        { productIds },

        config
      );

      toast.success("Stock updated successfully");
      setIncrementBy(null);

    
      close();
    
      dispatch(listProducts())
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Error updating stock: " + error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        fontSize: "0.7rem",
      }}
    >
      {type === "orders" && (
        <>
          <Button
            size="small"
            sx={{
              backgroundColor: theme.palette.orange.main,
              fontSize: "inherit",
            }}
            onClick={() => onAction("markAsShipped")}
          >
            Mark as Shipped
          </Button>
          <Button
            size="small"
            sx={{
              backgroundColor: theme.palette.green.main,
              fontSize: "inherit",
            }}
            onClick={() => onAction("markAsDelivered")}
          >
            Mark as Delivered
          </Button>
          <Button
            size="small"
            sx={{
              backgroundColor: theme.palette.error.main,
              fontSize: "inherit",
            }}
            onClick={() => onAction("cancelOrders")}
          >
            Cancel Orders
          </Button>
          <Button
            size="small"
            sx={{
              backgroundColor: "crimson",
              fontSize: "inherit",
            }}
            onClick={() => handleGenerateInvoices(selectionModel)}
          >
            Print Invoices
          </Button>

          <Button
            size="small"
            sx={{
              backgroundColor: theme.palette.secondary.dark,
              fontSize: "inherit",
            }}
            onClick={() => onAction("deleteOrders")}
          >
            Delete Orders
          </Button>
        </>
      )}
      {type === "products" && (
        <>
          <CustomModal1>
            <CustomModal1.Open opens="update-stock">
              <Button
                sx={{
                  backgroundColor: theme.palette.green.main,
                  fontSize: "inherit",
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  try {
                    openModal("update-stock"); // Now using the renamed function
                  } catch (error) {
                    console.error("Error opening modal:", error);
                    toast.error("Failed to open the modal.");
                  }
                }}
              >
                Update Stock
              </Button>
            </CustomModal1.Open>
            <CustomModal1.Window name="update-stock">
              <>
                <TextField
                  type="number"
                  label="Increment By"
                  value={incrementBy}
                  onChange={(e) => setIncrementBy(Number(e.target.value))}
                  sx={{ marginTop: "1rem" }}
                />
                <Button
                  sx={{
                    marginTop: "1rem",
                    backgroundColor: theme.palette.green.main,
                  }}
                  onClick={() => handleUpdateStock(selectionModel, incrementBy)}
                >
                  Update Stock count
                </Button>
              </>
            </CustomModal1.Window>
          </CustomModal1>

          <Button
            sx={{
              backgroundColor: theme.palette.error.main,
              fontSize: "inherit",
            }}
            onClick={() => onAction("deleteProducts")}
          >
            Delete Products
          </Button>
        </>
      )}
      {type === "users" && (
        <>
          <Button
            sx={{
              backgroundColor: theme.palette.orange.main,
              fontSize: "inherit",
            }}
            onClick={() => onAction("activateUsers")}
          >
            Activate Users
          </Button>
          <Button
            sx={{
              backgroundColor: theme.palette.error.main,
              fontSize: "inherit",
            }}
            onClick={() => onAction("deactivateUsers")}
          >
            Deactivate Users
          </Button>
        </>
      )}
    </Box>
  );
};

export default BulkActions;
