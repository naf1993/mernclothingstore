import { Container, Paper, Typography, Grid, Button } from "@mui/material";
import Header from "components/Header";
import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSingleOrder } from "actions/orderActions";
import Loader from "components/loader/Loader";
import Message from "components/Message";
import { useNavigate } from "react-router-dom";

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const orderDetails = useSelector((state) => state.order);
  const { loading, error, singleOrder:order } = orderDetails;
  console.log(id);

  useEffect(() => {
    if(id){
        dispatch(getSingleOrder(`${id}`));
    }
   
  }, [id, dispatch]);
  return (
    <Container>
      <Header title="Order Details" />
      <Paper elevation={3} sx={{ padding: 3 }}>
        {loading && <Loader />}
        {error && <Message error={error} />}
        {order && (
          <>
            <Typography variant="h6">Order ID: {order.orderId}</Typography>
            <Typography variant="subtitle1">User: {order.user.name}</Typography>
            <Typography variant="subtitle1">Address:</Typography>
            <Typography>
              {order.address.fullName}, {order.address.streetName},{" "}
              {order.address.city}, {order.address.country},{" "}
              {order.address.postalCode}
            </Typography>

            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Products
            </Typography>
            <Grid container spacing={2}>
              {order.products.map((item) => (
                <Grid item xs={12} md={6} key={item.product._id}>
                  <Paper elevation={1} sx={{ padding: 2 }}>
                    <Typography variant="subtitle1">
                      {item.product.name}
                    </Typography>
                    <Typography>Quantity: {item.count}</Typography>
                    <Typography>Price: ${item.price.toFixed(2)}</Typography>
                    {item.color && <Typography>Color: {item.color}</Typography>}
                    {item.size && <Typography>Size: {item.size}</Typography>}
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Total Price: ${order.totalPrice.toFixed(2)}
            </Typography>
            <Typography>Payment Method: {order.paymentMethod}</Typography>
            <Typography>Payment Status: {order.paymentStatus}</Typography>
            <Typography>Order Status: {order.orderStatus}</Typography>

            <Button onClick={() => navigate('/orders')} variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Back to Orders
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default OrderDetail;
