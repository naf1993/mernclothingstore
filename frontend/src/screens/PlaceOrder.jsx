import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader"; // Assuming you have a Loader component
import { createNewOrder } from "../actions/orderActions";
import { getMyCart } from "../actions/cartActions";
import Headings from "../components/Headings";
import ShippingAddress from "../components/ShippingAddress";

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const {
    products: cartItems,
    subTotal,
    loading: loadingCart,
    error: errorCart,
  } = useSelector((state) => state.cart);

  const { isAuthenticated } = user;
  // const { order, loading, error } = useSelector((state) => state.order);

  const [shippingFee] = useState(60); // Example shipping fee
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [finalPrice, setFinalPrice] = useState(subTotal + shippingFee);

  const [address, setAddress] = useState({
    fullName: "",
    streetName: "",
    city: "",
    country: "",
    postalCode: "",
  });
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyCart());
    }
  }, []);
  // Recalculate final price when subtotal or shipping fee changes
  useEffect(() => {
    setFinalPrice(subTotal + shippingFee);
  }, [subTotal]);

  // const handlePlaceOrder = () => {
  //   const orderData = {
  //     products: cartItems,
  //     paymentMethod,
  //     totalPrice: subTotal,
  //     shippingFee,
  //     finalPrice,
  //     address,
  //   };
  //   dispatch(createNewOrder(orderData)); // Dispatch the action to create the order
  // };

  // Redirect if order is created successfully
  // useEffect(() => {
  //   if (order) {
  //     navigate(`/orders/${order._id}`); // Redirect to order details page (for example)
  //   }
  // }, [order, navigate]);

  // if (loading) return <Loader />;  // Show loader while order is being created
  // if (error) return <div>{error}</div>;  // Show error message if any

  return (
    <div className="place-order-container">
      <div className="heading">
        <Headings>Order Summary</Headings>
      </div>
      <div className="place-order-wrapper">
        <div className="place-order-wrapper__left">
        <h4>Shipping Info</h4>
          <ShippingAddress address={address} setAddress={setAddress} />
          <div>
            <h3>Order Items</h3>
            <ul>
              {cartItems?.map((item) => (
                <li key={item.product}>
                  <div>{item.name}</div>
                  <div>Price: ${item.price}</div>
                  <div>Quantity: {item.count}</div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Payment Method</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="PayPal">PayPal</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </div>
        </div>
        <div className="place-order-wrapper__right">
          <div>
            <h3>Order Summary</h3>
            <div>Total Price: ${subTotal.toFixed(2)}</div>
            <div>Shipping Fee: ${shippingFee}</div>
            <div>Final Price: ${finalPrice.toFixed(2)}</div>
          </div>

          <button>Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
