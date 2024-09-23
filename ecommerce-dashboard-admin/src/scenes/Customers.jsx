import React from 'react'
import {Box,useTheme,Button} from '@mui/material'
import {Link} from 'react-router-dom'
import Header from '../components/Header'
import FlexBetween from '../components/FlexBetween';
import DataGridComponent from 'components/DataGridComponent';

const Customers = () => {
  const theme = useTheme();

  return (
    <Box m="1.5rem 2.5rem">
     <FlexBetween>
      <Header title="CUSTOMERS" subtitle="List of Customers" />
      <Link to='/' style={{textDecoration:'none'}}>
      <Button variant="contained" size="small" sx={{backgroundColor:theme.palette.background.table,color:'white',padding:'.5rem 1rem', ":hover": {
      backgroundColor: "orange"
    }}}>Create New User</Button></Link>
     </FlexBetween>
     <DataGridComponent type="users" />
    </Box>
  )
}

export default Customers