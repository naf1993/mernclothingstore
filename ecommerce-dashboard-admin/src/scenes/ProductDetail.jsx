import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Fade,
  useTheme,
} from "@mui/material";
import Header from "components/Header";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Loader from "components/loader/Loader";
import Message from "components/Message";
import { useNavigate } from "react-router-dom";
import { listProductDetails } from "actions/productActions";

const ProductDetail = () => {
  const { id } = useParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const [mainImage, setMainImage] = useState(product?.images[0]);
  console.log(id);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(listProductDetails(`${id}`));
    }
  }, [id, dispatch]);
  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]);
    }
  }, [product]);
  const handleImageClick = (image) => {
    setFade(true);
    setTimeout(() => {
      setMainImage(image);
      setFade(false);
    }, 500);
  };
  return (
    <Container>
      <Header title="Product Details" />
      <Paper elevation={3} sx={{   backgroundColor: '#f5f5f5' ,padding: 3, marginTop: "1rem" }}>
        {loading && <Loader />}
        {error && <Message error={error} />}
        {product && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column">
                <Fade in={!fade} timeout={500}>
                  <img
                    src={mainImage}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                  />
                </Fade>

                <Box display="flex" justifyContent="space-between">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      style={{
                        width: "30%",
                        cursor: "pointer",
                        border: "2px solid transparent",
                        borderRadius: "4px",
                      }}
                      onClick={() => {
                        handleImageClick(image); // Update main image on click
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid
              sx={{
                marginTop: { xs: "1rem", md: '0.5rem' },
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
              item
              xs={12}
              md={6}
            >
              <Typography variant="h3">
                Product Name: {product && product.name}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.secondary.dark,
                  fontWeight: "light",
                }}
                variant="h4"
              >
                Price: ${product && product.price}
              </Typography>
              <Typography variant="subtitle1">
                Description: {product && product.description}
              </Typography>
              <Typography variant="subtitle1">
                Stock: {product && product.countInStock}
              </Typography>
              <Typography variant="subtitle1">
                Category: {product && product.Category?.name}
              </Typography>
              <Typography variant="subtitle1">
                SubCategory: {product && product.SubCategory?.name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={() => navigate("/products/table")} // Navigate back to products list
              >
                Back to Products
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default ProductDetail;
