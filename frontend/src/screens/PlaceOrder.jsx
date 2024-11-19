import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader"; // Assuming you have a Loader component
import { createNewOrder, getUpdatedOrder } from "../actions/orderActions";
import { clearMyCart, getMyCart } from "../actions/cartActions";
import { isValidPhoneNumber } from "libphonenumber-js";
import Headings from "../components/Headings";
import ShippingAddress from "../components/ShippingAddress";
import toast from "react-hot-toast";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { finalPrice: priceAfterApplyingCoupon = 0, selectedCoupon = {} } =
    location.state || {};

  const user = useSelector((state) => state.user);
  const {
    cartId,
    products: cartItems,
    subTotal,
    loading: loadingCart,
    error: errorCart,
  } = useSelector((state) => state.cart);

  const { isAuthenticated, user: loggedInUser, token } = user;
  const { _id: userId } = loggedInUser;

  const {
    order: userOrder,
    loading: orderLoading,
    error: orderError,
    success: orderSuccess,
  } = useSelector((state) => state.order);
  
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [finalPrice, setFinalPrice] = useState(
    Number(priceAfterApplyingCoupon) + shippingFee || 0
  );

  const [address, setAddress] = useState({
    fullName: "",
    streetName: "",
    city: "",
    country: "",
    postalCode: "",
    contactNumber: "",
    houseName: "",
  });
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getMyCart());
    }
  }, []);
  useEffect(() => {
    if (paymentMethod === "Cash on Delivery") {
      setShippingFee(60); // Set shipping fee to 60 for COD
    } else {
      setShippingFee(0); // No shipping fee for other methods
    }
  }, [paymentMethod]);

  // Recalculate final price whenever subtotal or shipping fee changes
  useEffect(() => {
    // Ensure priceAfterApplyingCoupon and shippingFee are valid numbers before updating
    const updatedFinalPrice = (
      Number(priceAfterApplyingCoupon) + shippingFee
    ).toFixed(2);
    setFinalPrice(parseFloat(updatedFinalPrice));
  }, [priceAfterApplyingCoupon, shippingFee]);

  useEffect(() => {
    if (address) {
      console.log("this is address");
      console.log(address);
    }
  }, [address]);
  useEffect(() => {
    if (paymentMethod === "Credit Card" && address.contactNumber !== '' && address.houseName !== '') {
      const fetchClientSecret = async () => {
        try {
          console.log(token);
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };

          const { data } = await axios.post(
            `${apiUrl}/api/orders/create-payment-intent`,
            {
              products: cartItems,
              address,
              paymentMethod,
              discountCode: selectedCoupon.code || "",
            },
            config
          );

          setClientSecret(data.data.clientSecret);
          setOrderId(data.data.orderId);

          return { clientSecret };
        } catch (error) {
          console.error("Error fetching client secret:", error);
          toast.error("Failed to retrieve payment details. Please try again.");
        }
      };
      fetchClientSecret();
    }
  }, [paymentMethod,address.contactNumber,address.houseName]);

  const stripe = useStripe();
  const elements = useElements();

  const handlePlaceOrderCashOrCard = async () => {
    if (!address.contactNumber || !address.streetName) {
      toast.error("Please enter building no/house name and contact number");
      return;
    }

    if (paymentMethod === "Cash on Delivery") {
      const orderData = {
        userId: userId,
        products: cartItems,
        address,
        paymentMethod,
        discountCode: selectedCoupon.code || "",
      };
      try {
        await dispatch(createNewOrder(orderData));
        toast.success("New Order Placed");
        navigate("/ordersuccess", {
          state: {
            orderId: userOrder?.orderId,
            totalPrice: userOrder?.finalPrice,
            items: userOrder?.products,
            shippingAddress: address,
          },
        });
        await dispatch(clearMyCart());
      } catch (error) {
        toast.error("Unable to process order", error.message);
      }
    } else if (paymentMethod === "Credit Card") {
      if (!stripe || !elements || !clientSecret) {
        console.log("no stripe configuration");
        return;
      }

      const cardElement = elements.getElement(CardElement);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        try {
          await dispatch(getUpdatedOrder(orderId));
          toast.success("New Order Placed");
          console.log('navigating')
          navigate("/ordersuccess", {
            state: {
              orderId: orderId,
              totalPrice: finalPrice,
              items: userOrder?.products,
              shippingAddress: address,
            },
          });
          await dispatch(clearMyCart());
        } catch (error) {
          toast.error("Unable to process order", error.message);
        }
      }
    }
  };

  return (
    <div className="page-container">
      <div className="place-order-wrapper">
        <div className="place-order-wrapper__left">
          <h3>Shipping Info</h3>
          <ShippingAddress address={address} setAddress={setAddress} />
          <div className="order-items-wrapper">
            <h3>
              Order Items (No of Items is{" "}
              {cartItems.reduce((acc, it) => acc + it.count, 0)})
            </h3>

            {cartItems?.map((item, index) => (
              <div key={index}>
                <span>{item.name}</span>
                <span>Quantity {item.count}</span>
                <span>Price: ${item.total}</span>
              </div>
            ))}
          </div>
          {paymentMethod === "Credit Card" && <CardElement />}

          <div className="payment-wrapper">
            <div>
              <h3>Choose Payment Method</h3>

              <select
                className="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash on Delivery">Cash on Delivery</option>

                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
          </div>
        </div>
        <div className="place-order-wrapper__right">
          <h3>Order Summary</h3>
          <div>
            <span>Total Price:</span>
            <span> ₹{subTotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Shipping Charge:</span>
            {paymentMethod === "Cash on Delivery" && (
              <span>₹{shippingFee}</span>
            )}
            {paymentMethod !== "Cash on Delivery" && (
              <span>₹{shippingFee}</span>
            )}
          </div>
          <div>
            <span>Coupon Applied:</span>
            {selectedCoupon.discount > 0 && <span>{selectedCoupon.code}</span>}
            {selectedCoupon.discount < 0 && <span>NIL</span>}
          </div>
          <div>
            <span>Final Price:</span>
            <span> ₹{finalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrderCashOrCard}
            className="place-order-btn"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
