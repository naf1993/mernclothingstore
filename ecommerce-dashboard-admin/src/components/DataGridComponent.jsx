import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  useTheme,
  Stack,
  Tooltip,
  Button,
  Rating,
  gridClasses,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader/Loader";
import Message from "../components/Message";
import { deleteProductById, listProducts } from "actions/productActions";
import { listUsers } from "actions/userActions";
import CustomerActions from "./CustomerActions";
import moment from "moment";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { grey } from "@mui/material/colors";
import CustomModal1 from "./CustomModal1";
import CreateProduct from "./CreateProduct";
import { HiPencil } from "react-icons/hi2";
import ConfirmDelete from "./ui/ConfirmDelete";
import { maxWidth } from "@mui/system";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const DataGridComponent = ({ type }) => {
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const deleteProduct = useSelector((state) => state.deleteProduct);
  const { loading: loadingDelete, success, error: errorDelete } = deleteProduct;
  const [loadDelete, setLoadDelete] = useState(false);
  const { items, loading, error } = useSelector((state) => {
    if (type === "products") {
      return state.productList;
    } else {
      return state.userList;
    }
  });

  const onDelete = async (id, onCloseModal) => {
    console.log(id);
    setLoadDelete(true);
    try {
      await dispatch(deleteProductById(id));
      toast.success("Product Deleted");
      onCloseModal();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadDelete(false);
    }
  };

  useEffect(() => {
    if (type === "products") {
      dispatch(listProducts());
    } else {
      dispatch(listUsers());
    }
  }, [dispatch, type]);

  const columns =
    type === "products"
      ? [
          {
            field: "images",
            headerName: "Image",
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
              <Box
                component="img"
                sx={{
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  borderRadius: "50%",
                }}
                src={params.row.images[0] || "/placeholder-image.png"} // Fallback image
                alt="Product"
              />
            ),
          },
          {
            field: "name",
            headerName: "Name",
            width: 140,
          },
          {
            field: "category",
            headerName: "Category",
            width: 100,
            renderCell: (params) => {
              const { name } = params.row.Category;
              return <p>{name}</p>;
            },
          },
          {
            field: "subcategory",
            headerName: "Sub Category",
            width: 100,
            renderCell: (params) => {
              const name = params.row.SubCategory
                ? params.row.SubCategory.name
                : "No category";
              return <p>{name}</p>;
            },
          },
          {
            field: "price",
            headerName: "Price",
            width: 80,
          },
          {
            field: "colors",
            headerName: "Colors",
            width: 130,
            maxWidth: 190,
            renderCell: (params) => {
              const colors = params.row.colors || [];

              return (
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {colors.map((color, index) => (
                    <Tooltip key={index} title={color}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: color,
                          border: "1px solid #ccc",
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              );
            },
          },
          {
            field: "countInStock",
            headerName: "Stock",
            width: 80,
            align: "center",
          },
          {
            field: "ratingsAverage",
            headerName: "Rating",
            width: 110,
            renderCell: (params) => (
              <Rating
                name="ratingsAverage"
                value={params.value}
                precision={0.5}
                readOnly
                size="small"
              />
            ),
          },

          {
            field: "action",
            headerName: "Action",
            width: 120,
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => (           
                <CustomModal1>
                  <CustomModal1.Open opens="edit">
                    <Button style={{ color: "green" }}>
                      <AiOutlineEdit style={{ fontSize: "1rem" }} />
                    </Button>
                  </CustomModal1.Open>
                  <CustomModal1.Window name="edit">
                    <CreateProduct product={params.row} />
                  </CustomModal1.Window>

                  <CustomModal1.Open opens="delete">
                    <Button style={{ color: "red" }}>
                      <AiOutlineDelete style={{ fontSize: "1rem" }} />
                    </Button>
                  </CustomModal1.Open>
                  <CustomModal1.Window name="delete">
                    <ConfirmDelete
                      productname={params.row.name}
                      onConfirm={() => onDelete(params.row.id, onCloseModal)} // Pass onCloseModal to the deletion logic
                      disabled={loadingDelete}
                      onCloseModal={onCloseModal} // Ensure the modal can be closed
                      loading={loadDelete}
                    />
                  </CustomModal1.Window>
                </CustomModal1>
              )
          }
        ]
      : [
          {
            field: "name",
            headerName: "Name",
            width: 150,
            headerAlign: "center",
          },
          {
            field: "email",
            headerName: "Email",
            width: 150,
            headerAlign: "center",
          },

          {
            field: "active",
            headerName: "Account Status",
            width: 150,
            type: "boolean",
            editable: true,
            headerAlign: "center",
          },

          {
            field: "createdAt",
            headerName: "Date Created",
            width: 150,
            headerAlign: "center",
            renderCell: (params) =>
              moment(params.row.createdAt).format("YYYY-MM-DD"),
          },

          {
            field: "actions",
            headerName: "Actions",
            type: "actions",
            headerAlign: "center",
            renderCell: (params) => (
              <CustomerActions {...{ params, rowId, setRowId }} />
            ),
          },
        ];
  return (
    <>
      <Box
        mt="20px"
        height="75vh"
        width="100%"
        overflow="auto"
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

            color: theme.palette.primary.textcolor,
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
            rowsPerPageOptions={[5, 10, 20]}
            pageSize={pageSize}
            autoHeight
            rowHeight={50}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            checkboxSelection={false} // Disable checkbox selection
            disableSelectionOnClick // Disable selection on cell click
            sx={{
              "& .MuiDataGrid-cell": {
                padding: "8px",
                fontSize: "12px", // Reduce font size for cells
              },
              "& .MuiDataGrid-columnHeaders": {
                fontSize: "12px", // Reduce font size for headers
                padding: "8px", // Adjust padding to fit smaller text
              },
              [`& .${gridClasses.row}`]: {
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? grey[800] : grey[900],
              },
            }}
            onCellEditCommit={(params) => setRowId(params.id)}
          />
        ) : (
          []
        )}
      </Box>
    </>
  );
};

export default DataGridComponent;
