import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, useTheme, Stack, Button, Rating,gridClasses } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader/Loader";
import Message from "../components/Message";
import { listProducts } from "actions/productActions";
import { listUsers } from "actions/userActions";
import CustomerActions from "./CustomerActions";
import moment from "moment";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import {grey} from '@mui/material/colors'
const DataGridComponent = ({ type }) => {
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();
  const theme = useTheme();

  const { items, loading, error } = useSelector((state) => {
    if (type === "products") {
      return state.productList;
    } else {
      return state.userList;
    }
  });

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
            width: 140,
            renderCell: (params) => {
              const { name } = params.row.Category;
              return <p>{name}</p>;
            },
          },
          {
            field: "price",
            headerName: "Price",
            width: 80,
          },
          {
            field: "countInStock",
            headerName: "Stock",
            width: 80,
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
            width: 200,
            sortable: false,
            disableClickEventBubbling: true,
            renderCell: (params) => {
              const onClick = (e) => {
                const currentRow = params.row;
                // Add confirmation before alerting
                if (
                  e.target.innerText === "Delete" &&
                  !window.confirm("Are you sure you want to delete this item?")
                ) {
                  return;
                }
                alert(JSON.stringify(currentRow, null, 4));
              };

              return (
                <Stack direction="row" spacing={1}>
                  <Button style={{ color: "green" }} onClick={onClick}>
                    <AiOutlineEdit style={{ fontSize: "1.2rem" }} />
                  </Button>
                  <Button color="error" onClick={onClick}>
                    <AiOutlineDelete style={{ fontSize: "1.2rem" }} />
                  </Button>
                </Stack>
              );
            },
          },
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
        height="75vh" width='100%' overflow='auto'
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
            pageSize={pageSize} autoHeight rowHeight={50}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            sx={{ "& .MuiDataGrid-cell": {
              padding: "8px",
            },
              m: 2,
              p: 2,
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
