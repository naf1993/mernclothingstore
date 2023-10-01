import React ,{useState}from 'react'
import { Link } from 'react-router-dom';
import {Box,Button,Paper,useTheme} from '@mui/material'
import Header from "../components/Header";
import FlexBetween from "components/FlexBetween";
import Grid from '@mui/material/Grid';
import { alpha,styled } from '@mui/material/styles';
import TextField,{TextFieldProps} from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import { FormControl } from '@mui/material';
import  InputLabel  from '@mui/material/InputLabel';
const Item = styled(Paper)(({theme})=>({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}))


const BootstrapInput = styled(InputBase)(({theme})=>({
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    border: `1px solid theme.palette.primary.main`,
    fontSize: 16,
    width: '100%',
    padding: '10px 15px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.tertiary.medium, 0.25)} 0 0 0 0.2rem`,
      borderColor: '20px solid blue',
    },
  },
}))
const ProductCreate = () => {
    const theme = useTheme();
    const [name,setName] = useState(null)

  return (
    <Box m="1.5rem 2.5rem">
     <FlexBetween>
      <Header title="ADD NEW PRODUCT" subtitle="" />
      <Link to='/products' style={{textDecoration:'none'}}>
      <Button variant="contained" size="small" sx={{backgroundColor:theme.palette.background.table,color:'white',boxShadow:'none',padding:'.5rem 1rem', ":hover": {
      backgroundColor: "orange"
    }}}>Go back</Button></Link>
    </FlexBetween>
    <Box m='1.5rem 2.5rem'>
    <Box
      component="form"
      sx={{
        '& > :not(style)': {  },
      }}
      noValidate
      autoComplete="off"
    >
        <Grid container spacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} md={6} lg={3}>
            <FormControl variant="standard">
        <InputLabel id="bootstrap-input">
          Bootstrap
        </InputLabel>
        <BootstrapInput defaultValue="react-bootstrap" id="bootstrap-input" />
      </FormControl>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
            <Item>2</Item>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
            <Item>3</Item>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
            <TextField
          style={{ width: "200px", margin: "5px" }}
          type="text"
          label="setgoal"
          variant="filled"
        />
            </Grid>
        </Grid>
        </Box>


    </Box>
    </Box>
  )
}

export default ProductCreate