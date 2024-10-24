import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  useTheme,
  Tooltip,
  Button,
  Rating,
  gridClasses,
  Typography,
  Badge,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader/Loader";
import Message from "../components/Message";
import {
  deleteProductById,
  listProducts,
  updateProduct,
} from "actions/productActions";
import { listUsers } from "actions/userActions";
import CustomerActions from "./CustomerActions";
import moment from "moment";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { grey } from "@mui/material/colors";
import CustomModal1 from "./CustomModal1";
import CreateProduct from "./CreateProduct";
import ConfirmDelete from "./ui/ConfirmDelete";
import toast from "react-hot-toast";
import { ModalContext } from "./CustomModal1";
import FilterComponent from "./ui/FilterComponent";
import { getAllOrders, updateOrderStatus } from "actions/orderActions";
import FilterOrders from "./ui/FilterOrders";
import EditOrder from "./ui/EditOrder";
import { useNavigate } from "react-router-dom";
import { bulkAction } from "actions/bulkActions";
import BulkActions from "./BulkActions";

const getRandomBackgroundColor = () => {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
const statusColorMapping = {
  paymentStatus: {
    Pending: "#FFCC00", /// Yellow
    Paid: "#4CAF50", // Green
    Failed: "#F44336", // Red
  },
  orderStatus: {
    "Not Processed": "#FFC107", // Amber
    Processing: "#2196F3", // Blue
    Shipped: "#FF9800", // Orange
    Delivered: "#8BC34A", // Light Green
    Cancelled: "#F44336",
  },
};

const DataGridComponent = ({ type, refresh }) => {
  const [selectionModel, setSelectionModel] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useTheme();
  const deleteProduct = useSelector((state) => state.deleteProduct);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = deleteProduct;
  const editProduct = useSelector((state) => state.editProduct);
  const {
    loading: loadingEdit,
    error: errorEdit,
    success: successEdit,
  } = editProduct;
  const orderUpdate = useSelector((state) => state.order);
  const {
    loading: loadingOrderUpdate,
    success: successOrderupdate,
    error: errorOrderUpdate,
  } = orderUpdate;
  const [loadDelete, setLoadDelete] = useState(false);
  const [loadEdit, setLoadEdit] = useState(false);
  const {
    loading: bulkorderloading,
    error: bulkordererror,
    success: bulkordersuccess,
  } = useSelector((state) => state.bulkAction);
  const items = useSelector((state) => {
    switch (type) {
      case "products":
        return state.productList.items;
      case "users":
        return state.userList.items;
      case "orders":
        return state.order.items;
      default:
        return [];
    }
  });
  const loading = useSelector((state) => {
    switch (type) {
      case "products":
        return state.productList.loading;
      case "users":
        return state.userList.loading;
      case "orders":
        return state.order.loading; // Assuming you have loading state for orders
      default:
        return false; // Default loading state
    }
  });
  const error = useSelector((state) => {
    switch (type) {
      case "products":
        return state.productList.error;
      case "users":
        return state.userList.error;
      case "orders":
        return state.order.error; // Assuming you have error state for orders
      default:
        return null; // Default error state
    }
  });

  useEffect(() => {
    if (type === "products") {
      console.log("refreshed data grid");
      dispatch(listProducts());
    } else if (type === "users") {
      dispatch(listUsers());
    } else {
      dispatch(getAllOrders());
    }
  }, [dispatch, type, refresh]);
  const [filteredProducts, setFilteredProducts] = useState(items);
  const [noResults, setNoResults] = useState(false);
  const handleFilterChange = (filteredProducts) => {
    setFilteredProducts(filteredProducts);
    setNoResults(filteredProducts.length === 0);
  };

  const categoryColors = {};
  const subCategoryColors = {};
  if (type === "products") {
    items.forEach((item) => {
      const category = item.Category?.name || "Unknown";
      if (!categoryColors[category]) {
        categoryColors[category] = getRandomBackgroundColor(); // Assign a random color if not already assigned
      }
    });
    items.forEach((item) => {
      const subCategory = item.SubCategory?.name || "Unknown";
      if (!subCategoryColors[subCategory]) {
        subCategoryColors[subCategory] = getRandomBackgroundColor();
      }
    });
  }

  const { close } = useContext(ModalContext);
  const onEditOrder = async (id, status) => {
    console.log(id);
    try {
      await dispatch(updateOrderStatus(id, status));
      if (successOrderupdate) {
        toast.success("Order Updated");
      }
      if (errorOrderUpdate) {
        toast.error(errorOrderUpdate);
      }
      close();
      if (type === "orders") {
        dispatch(getAllOrders());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const onEdit = async (id, product) => {
    console.log(product);
    setLoadEdit(true);
    try {
      await dispatch(updateProduct(id, product));
      if (successEdit) {
        toast.success("Product Edited");
      }
      if (errorEdit) {
        toast.error(errorEdit);
      }

      close();
      if (type === "products") {
        dispatch(listProducts()); // This should refresh the product list
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadEdit(false);
    }
  };
  const onDelete = async (id) => {
    console.log(id);
    setLoadDelete(true);
    try {
      await dispatch(deleteProductById(id));

      close();
      if (successDelete) {
        toast.success("Product Deleted");
      }
      if (errorDelete) {
        toast.error(errorEdit);
      }
      if (type === "products") {
        dispatch(listProducts()); // This should refresh the product list
      }
    } catch (error) {
      toast.error("Unable to delete product");
    } finally {
      setLoadDelete(false);
    }
  };

  useEffect(() => {
    setFilteredProducts(items); // Update filteredProducts whenever items change
  }, [items]);

  const handleBulkAction = async (action) => {
    await dispatch(bulkAction(type, action, selectionModel));
  };
  useEffect(() => {
    if (bulkordersuccess) {
      if (type === "products") {
        dispatch(listUsers());
      } else if (type === "orders") {
        dispatch(getAllOrders());
      } else {
        dispatch(listUsers());
      }
    }
  }, [bulkordersuccess, type, dispatch]);

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
            filterable: true,
            renderCell: (params) => {
              let name = params.row.name;
              return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            },
          },
          {
            field: "category",
            headerName: "Category",
            width: 100,
            renderCell: (params) => {
              const category = params.row.Category?.name || "Unknown";
              const backgroundColor = categoryColors[category] || "FFFFFF";
              return (
                <Box
                  sx={{
                    backgroundColor,
                    padding: "4px",
                    borderRadius: "8px",
                    color: "white",
                  }}
                >
                  {category}
                </Box>
              );
            },
            filterable: true,
          },
          {
            field: "subcategory",
            headerName: "SubCategory",
            width: 100,
            renderCell: (params) => {
              const subcategory = params.row.SubCategory?.name || "Unknown";
              const backgroundColor =
                subCategoryColors[subcategory] || "FFFFFF";
              return (
                <Box
                  sx={{
                    backgroundColor,
                    padding: "4px",
                    borderRadius: "8px",
                    color: "white",
                  }}
                >
                  {subcategory}
                </Box>
              );
            },
            filterable: true,
          },

          {
            field: "price",
            headerName: "Price",
            width: 80,
            renderCell: (params) => (
              <Typography variant="h6">{params.row.price}</Typography>
            ),
          },
          {
            field: "isFeatured",
            headerName: "Featured",
            width: 80,
            renderCell: (params) => (
              <Typography variant="h6">
                {params.row.isFeatured ? "Yes" : "No"}
              </Typography>
            ),
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
            field: "sizes",
            headerName: "Size",
            width: 100,
            maxWidth: 120,
            renderCell: (params) => {
              const sizes = params.row.sizes || [];

              return (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {sizes.length === 0 && <Typography>Free Size</Typography>}
                  {sizes.length > 0 &&
                    sizes.map((size, index) => (
                      <Typography key={index}>{size || "No Size"}</Typography>
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
                  <Button
                    style={{ color: "green" }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <AiOutlineEdit style={{ fontSize: "1rem" }} />
                  </Button>
                </CustomModal1.Open>
                <CustomModal1.Window name="edit">
                  <CreateProduct
                    productToEdit={params.row}
                    onEdit={onEdit}
                    isEditing={loadingEdit}
                  />
                </CustomModal1.Window>

                <CustomModal1.Open opens="delete">
                  <Button
                    style={{ color: "red" }}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <AiOutlineDelete style={{ fontSize: "1rem" }} />
                  </Button>
                </CustomModal1.Open>
                <CustomModal1.Window name="delete">
                  <ConfirmDelete
                    productname={params.row.name}
                    onConfirm={() => onDelete(params.row.id)} // Pass onCloseModal to the deletion logic
                    disabled={loadingDelete}
                    loading={loadDelete}
                  />
                </CustomModal1.Window>
              </CustomModal1>
            ),
          },
        ]
      : type === "users"
      ? [
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
        ]
      : [
          /* Order ID
          Customer Name
          Email/Contact
          Order Date
          Total Amount
          Payment Status (e.g., Paid, Pending, Failed)
          Order Status (e.g., Processing, Dispatched, Delivered, Cancelled)
          Actions (View, Edit, Delete) */
          {
            field: "orderId",
            headerName: "Order ID",
            width: 100,
            renderCell: (params) => (
              <Typography sx={{ fontSize: "0.7rem" }} variant="p">
                {params.value}
              </Typography>
            ),
          },
          {
            field: "name",
            headerName: "Customer Name",
            width: 120,

            renderCell: (params) => {
              const name = params.row.user?.name || "Unknown";

              return (
                <Typography sx={{ fontSize: "0.7rem" }} variant="p">
                  {name}
                </Typography>
              );
            },
            filterable: true,
          },
          {
            field: "email",
            headerName: "Email/Contact",
            width: 200,
            renderCell: (params) => {
              const email = params.row.user?.email || "Unknown";

              return (
                <Typography sx={{ fontSize: "0.7rem" }} variant="p">
                  {email}
                </Typography>
              );
            },
            filterable: true,
          },

          {
            field: "totalPrice",
            headerName: "Amount",
            width: 80,

            filterable: true,
            renderCell: (params) => (
              <Typography sx={{ fontSize: "0.7rem" }} variant="p">
                {params.value}
              </Typography>
            ),
          },
          {
            field: "paymentMethod",
            headerName: "Payment By",
            width: 150,
            renderCell: (params) => (
              <Typography sx={{ fontSize: "0.7rem" }} variant="p">
                {params.value}
              </Typography>
            ),
          },
          {
            field: "paymentStatus",
            headerName: "Status",
            width: 80,
            renderCell: (params) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center", // Centers vertically
                  justifyContent: "center", // Centers horizontally
                  height: "100%", // Ensure full height of the cell
                  padding: "0", // Remove default padding
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      statusColorMapping.paymentStatus[params.value] ||
                      "transparent",
                    color: "white",
                    padding: "5px 8px",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontSize: "0.7rem",
                    whiteSpace: "nowrap", // Prevent wrapping
                  }}
                >
                  {params.value}
                </div>
              </div>
            ),
          },
          {
            field: "orderStatus",
            headerName: "Order Status",
            width: 130,
            renderCell: (params) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center", // Centers vertically
                  justifyContent: "center", // Centers horizontally
                  height: "100%", // Ensure full height of the cell
                  padding: "0", // Remove default padding
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      statusColorMapping.orderStatus[params.value] ||
                      "transparent",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontSize: "0.7rem",
                    whiteSpace: "nowrap", // Prevent wrapping
                  }}
                >
                  {params.value}
                </div>
              </div>
            ),
          },
          {
            field: "saleDate",
            headerName: "Order Date",

            width: 100,
            renderCell: (params) => (
              <Typography sx={{ fontSize: "0.7rem" }} variant="p">
                {moment(params.row.saleDate).format("YYYY-MM-DD")}
              </Typography>
            ),
          },
          {
            field: "action",
            headerName: "Action",
            width: 150,
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => (
              <>
                <CustomModal1>
                  <CustomModal1.Open opens="edit-order">
                    <Button
                      style={{ color: "green" }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <AiOutlineEdit style={{ fontSize: "1rem" }} />
                    </Button>
                  </CustomModal1.Open>
                  <CustomModal1.Window name="edit-order">
                    <EditOrder
                      orderStatus={params.row.orderStatus}
                      orderId={params.row._id}
                      onEdit={onEditOrder}
                      isUpdatingOrder={loadingOrderUpdate}
                    />
                  </CustomModal1.Window>

                  <CustomModal1.Open opens="delete">
                    <Button
                      style={{ color: "red" }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <AiOutlineDelete style={{ fontSize: "1rem" }} />
                    </Button>
                  </CustomModal1.Open>
                  <CustomModal1.Window name="delete">
                    <p>you want to delete</p>
                  </CustomModal1.Window>
                </CustomModal1>
              </>
            ),
          },
        ];
  return (
    <>
      {type === "products" && (
        <FilterComponent items={items} onFilterChange={handleFilterChange} />
      )}
      {type === "orders" && (
        <FilterOrders items={items} onFilterChange={handleFilterChange} />
      )}

      <Box
        mt="20px"
        height="64vh"
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
        ) : filteredProducts.length > 0 ? (
          <DataGrid
            getRowId={(row) => row._id}
            rows={filteredProducts}
            columns={columns}
            rowsPerPageOptions={[5, 10, 20]}
            pageSize={pageSize}
            autoHeight
            rowHeight={50}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            checkboxSelection
            onSelectionModelChange={(newSelection) => {
              console.log(newSelection);
              setSelectionModel(newSelection);
            }} // Disable checkbox selection
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
            onRowClick={(params) => {
              const id = params.row._id;
              if (type === "products") {
                navigate(`/products/${id}`);
              } else if (type === "orders") {
                navigate(`/orders/${id}`);
              }
              // Add additional cases for other types if needed
            }}
          />
        ) : (
          noResults && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Typography variant="h6" color="error">
                No results found
              </Typography>
            </Box>
          )
        )}
        
      </Box>
      {selectionModel.length > 0 && (
          <BulkActions
            type={type}
            selectionModel={selectionModel}
            onAction={handleBulkAction}
          />
        )}
    </>
  );
};

export default DataGridComponent;
