import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
  CardMedia,
} from "@mui/material";
import Chip from '@mui/material/Chip';
import {Link} from 'react-router-dom'
import VisibilityIcon from "@mui/icons-material/Visibility";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
};

const Product = ({ product }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const viewProduct = ()=>{
    console.log('hello')
  }
  return (
    <Link to={`/products/${product._id}`}>
    <Card sx={{ borderRadius: "0.55rem", margin: "0" }}>
      <CardMedia
        component="img"
        image={`./public/products/${product.imageCover}`}
        alt={"alt"}
        title={"titleasdasdsada"}
        sx={{ height: 200, width: "100%", objectFit: "cover" }}
      />
      <CardContent>
        <Box
          sx={{
            mb: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">{product.name}</Typography>
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="h6"
            color={theme.palette.secondary[700]}
          >
            ${Number(product.price).toFixed(2)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Rating
            name="ratingsAverage"
            value={product.ratingsAverage}
            precision={0.5}
            readOnly
            size="medium"
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#0073cf",
              padding: "5px 8px",
              borderRadius: "5px",
              '&:hover':{
                cursor:'pointer',
                backgroundColor:theme.palette.secondary[600]
              }
            }}
          >
            <VisibilityIcon sx={{ color: "white"}} onClick={viewProduct} />
          </Box>
        </Box>
        <Box sx={{mt:'1rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
       {(product.countInStock > 0)? ( <Chip label="Instock" sx={{color:'white',backgroundColor:'#138808',border:'none'}} size="small"/>):( <Chip label="Out of Stock" sx={{color:'white',backgroundColor:'#FF4F00'}} size='small' />)}
       
        </Box>
      </CardContent>
    </Card>
    </Link>
   
  );
};

export default Product;
