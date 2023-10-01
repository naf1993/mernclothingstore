import React,{useEffect,useMemo,useState} from 'react'
import {Box,Rating,useTheme,Stack,Button, gridClasses} from '@mui/material'
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/loader/Loader";
import Message from "../components/Message";
import {Link} from 'react-router-dom'
import { listUsers } from '../actions/userActions';
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import Header from '../components/Header'
import {grey} from '@mui/material/colors'
import FlexBetween from '../components/FlexBetween';
import moment from 'moment';
import CustomerActions from '../components/CustomerActions';

const Customers = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users }= userList;
  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);

  const columns = useMemo(() => [
  
    {
      field: "name",
      headerName: "Name",
      width: 150,
      headerAlign: 'center'
     
     
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      headerAlign: 'center'
    },
    
    {
      field:'active',
      headerName:'Account Status',
      width:150,
      type:'boolean',
      editable:true,
      headerAlign: 'center'
    },
   
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 150,
      headerAlign: 'center',
      renderCell:(params)=>moment(params.row.createdAt).format('YYYY-MM-DD')
    },
    { field: '_id', headerName: 'Id', width: 220 },
    {
      field:'actions',
      headerName:'Actions',
      type:'actions',
      headerAlign: 'center',
      renderCell:(params)=>(<CustomerActions {...{params,rowId,setRowId}}/>)
    }
  ],[rowId]);

  useEffect(()=>{
    dispatch(listUsers())
  },[dispatch])
  return (
    <Box m="1.5rem 2.5rem">
     <FlexBetween>
      <Header title="CUSTOMERS" subtitle="List of Customers" />
      <Link to='/' style={{textDecoration:'none'}}>
      <Button variant="contained" size="small" sx={{backgroundColor:theme.palette.background.table,color:'white',padding:'.5rem 1rem', ":hover": {
      backgroundColor: "orange"
    }}}>Create New Customer</Button></Link>
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
            paddingLeft:"20px"
           
          },
          // '& .MuiDataGrid-row:hover':{
          //   backgroundColor:'blue'
          // },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.table,
            color: theme.palette.secondary.main,
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.background.white,
          },
          "& .MuiDataGrid-footerContainer": {
          
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
        ) : users ? (
          <DataGrid
            getRowId={(row) => row._id}
            rows={users || []}
            columns={columns}
            rowsPerPageOptions={[5,10,20]}
            pageSize={pageSize}
            components={{Toolbar:GridToolbar}}
            onPageSizeChange={(newPageSize)=>setPageSize(newPageSize)}
            
            // getRowSpacing={(params)=>({
            //   top:params.isFirstVisible ? 0 : 5,
            //   bottom:params.isLastVisible ? 0 :5
            // })}
            sx={{m:2,p:2,[`& .${gridClasses.row}`]:{
              bgcolor:(theme)=>theme.palette.mode === 'light' ? grey[800] : grey[900]
            }}}
            onCellEditCommit={(params)=>setRowId(params.id)}
          />
        ) : (
          []
        )}
      </Box>
    </Box>
  )
}

export default Customers