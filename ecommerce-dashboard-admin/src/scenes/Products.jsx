import React, { useEffect, useMemo, useState } from "react";
import { Box,Rating, useTheme,Stack,Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader/Loader";
import Message from "../components/Message";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { listProducts } from "../actions/productActions";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../components/Header";
import FlexBetween from "components/FlexBetween";

const Products = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  const [value,setValue] = useState(null);
  const columns = useMemo(() => [
    {
      field: "imageCover",
      headerName: "Image",
      width: 80,
      sortable: false,
      filterable: false,

      renderCell: (params) => {
        return (
          <Box
            component="img"
            sx={{
              height: "100%",
              objectFit: "cover",
              display: "block",
              borderRadius: "50%",
            }}
            src={`./public/products/${params.value}`}
          />
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 120,
    },
    {
      field: "category",
      headerName: "Category",
      width: 80,
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
      renderCell: (params) => {
        return (
          <Rating name="ratingsAverage" value={params.value} precision={0.5} readOnly  size="small" />
        )}
    },
    {
      field: "_id",
      headerName: "ID",
      width: 220,
    },
    {
      field:'action',
      headerName:'Action',
      width:200,
      sortable:false,
      disableClickEventBubbling:true,
      renderCell:(params)=>{
        const onClick = (e)=>{
          const currentRow = params.row
          return alert(JSON.stringify(currentRow,null,4))
        }
        return (
          <Stack direction='row' spacing={2}>
             <Button variant="outlined" color="warning" size="small" onClick={onClick}>Edit</Button>
          <Button variant="outlined" color="error" size="small" onClick={onClick}>Delete</Button>
          </Stack>
        )
      }
    }
  ]);

  // const columns = [
  //   {
  //     field:'_id',
  //     headerName:'ID',
  //     flex:1,
  //     headerAlign: 'center',
  //   },
  //   {
  //     field:'imageCover',
  //     headerName:'Image',
  //     flex:1,
  //     headerAlign: 'center',

  //     renderCell:(params)=>{
  //       return ( <Box
  //         component="img"
  //         sx={{

  //       height: '100%',
  //       objectFit: 'cover',
  //       display: 'block',
  //       borderRadius:'50%'

  //         }}

  //         src={`./public/products/${params.value}`}
  //       />)
  //     }

  //   },
  //   {
  //     field:'name',
  //     headerName:'Name',
  //     flex:1,
  //     headerAlign: 'center',
  //   },
  //   {
  //     field:'category',
  //     headerName:'Category',
  //     flex:1,
  //     headerAlign: 'center',
  //   },
  //   {
  //     field:'price',
  //     headerName:'Price',
  //     headerAlign: 'center',
  //   },
  //   {
  //     field:'countInStock',
  //     headerName:'Stock',
  //     headerAlign: 'center',
  //   },
  //   {
  //     field:'ratingsAverage',
  //     headerName:'Rating',
  //     headerAlign: 'center',
  //   },

  // ]

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);
  return (
    <Box m="1.5rem 2.5rem">
     <FlexBetween>
      <Header title="PRODUCTS" subtitle="List of Products" />
      <Link to='/createProduct' style={{textDecoration:'none'}}>
      <Button variant="contained" size="small" sx={{backgroundColor:theme.palette.background.table,color:'white',padding:'.5rem 1rem', ":hover": {
      backgroundColor: "orange"
    }}}>Create New Product</Button></Link>
     </FlexBetween>
      <Box
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
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "white",
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[400]} !important`,
          },
        }}
      >
        {loading ? (
          <Loader />
        ) : error ? (
          <Message severity="error" error={error} />
        ) : products ? (
          
          <DataGrid
            getRowId={(row) => row._id}
            rows={products || []}
            columns={columns}
            rowsPerPageOptions={[5,10,20]}
            pageSize={pageSize}
            checkboxSelection={true}
        disableSelectionOnClick
          />
        ) : (
          []
        )}
      </Box>
    </Box>
  );
};

export default Products;
