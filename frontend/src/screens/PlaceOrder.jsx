import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader"; // Assuming you have a Loader component
import { createNewOrder } from "../actions/orderActions";
import { clearMyCart, getMyCart } from "../actions/cartActions";
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
  console.log(
    "final and disocunt from cart page",
    priceAfterApplyingCoupon,
    selectedCoupon
  );
  const user = useSelector((state) => state.user);
  const {
    cartId,
    products: cartItems,
    subTotal,
    loading: loadingCart,
    error: errorCart,
  } = useSelector((state) => state.cart);

  const { isAuthenticated, user: loggedInUser } = user;
  const { _id: userId } = loggedInUser;
  console.log(userId);
  const {
    order: userOrder,
    loading: orderLoading,
    error: orderError,
    success: orderSuccess,
  } = useSelector((state) => state.order);

  const [shippingFee, setShippingFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [finalPrice, setFinalPrice] = useState(
    Number(priceAfterApplyingCoupon) + shippingFee || 0
  );

  const [address, setAddress] = useState({
    fullName: "",
    streetName: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [clientSecret, setClientSecret] = useState(null);

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
    if (paymentMethod === "Credit Card") {
      const fetchClientSecret = async () => {
        try {
          // Convert finalPrice to paise (multiply by 100 to convert INR to paise)
          const amountInPaise = Math.round(finalPrice * 100);
  
          // Check if the amount is less than the minimum allowed (50 INR = 5000 paise)
          if (amountInPaise < 5000) {
            throw new Error("Amount must be at least ₹50");
          }
  
          const response = await axios.post(
            "http://localhost:5000/create-payment-intent",
            {
              amount: amountInPaise, // send amount in paise
              currency: "inr", // make sure you're using INR as the currency
            }
          );
  
          // Set the client secret from the response
          setClientSecret(response.data.clientSecret);
        } catch (error) {
          console.error("Error fetching client secret:", error);
          toast.error(error.message || "Failed to retrieve payment details. Please try again.");
        }
      };
  
      fetchClientSecret();
    }
  }, [paymentMethod, finalPrice]);

  const handlePlaceOrder = async () => {
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
    } catch (error) {
      toast.error("Unable to process order", error.message);
    }
  };
  useEffect(() => {
    if (orderSuccess) {
      if (userOrder) {
        navigate("/ordersuccess", {
          state: {
            orderId: userOrder?.orderId,
            totalPrice: userOrder?.finalPrice,
            items: userOrder?.products,
            shippingAddress: address,
          },
        });
        dispatch(clearMyCart());
      } else {
        toast.error("Failed to get order details");
      }
    }
  }, [userOrder, navigate, orderSuccess]);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmitPayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

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
      toast.success("Payment successful");
      handlePlaceOrder(); // Proceed with order placement after payment
    }
  };

  return (
    <div className="place-order-container">
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

          <div className="payment-wrapper">
            <div>
              <h3>Choose Payment Method</h3>

              <select
                className="payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="PayPal">PayPal</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
          </div>
          {paymentMethod === "Credit Card" && (
            <form onSubmit={handleSubmitPayment}>
              <CardElement />
              <button type="submit" disabled={!stripe}>
                Pay Now
              </button>
            </form>
          )}
        </div>
        <div className="place-order-wrapper__right">
          <h3>Order Summary</h3>
          <div>
            <span>Total Price:</span>
            <span> ${subTotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Shipping Charge:</span>
            {paymentMethod === "Cash on Delivery" && (
              <span>${shippingFee}</span>
            )}
            {paymentMethod !== "Cash on Delivery" && (
              <span>${shippingFee}</span>
            )}
          </div>
          <div>
            <span>Coupon Applied:</span>
            {selectedCoupon.discount > 0 && <span>{selectedCoupon.code}</span>}
            {selectedCoupon.discount < 0 && <span>NIL</span>}
          </div>
          <div>
            <span>Final Price:</span>
            <span> ${finalPrice.toFixed(2)}</span>
          </div>

          <button
            disabled={orderLoading}
            onClick={handlePlaceOrder}
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


// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { createNewOrder } from "../actions/orderActions";
// import { clearMyCart, getMyCart } from "../actions/cartActions";
// import ShippingAddress from "../components/ShippingAddress";
// import toast from "react-hot-toast";
// import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
// import axios from "axios";

// const PlaceOrder = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { finalPrice: priceAfterApplyingCoupon = 0, selectedCoupon = {} } = location.state || {};
//   const user = useSelector((state) => state.user);
//   const { cartId, products: cartItems, subTotal, loading: loadingCart } = useSelector((state) => state.cart);
//   const { isAuthenticated, user: loggedInUser } = user;
//   const { _id: userId } = loggedInUser;

//   const [shippingFee, setShippingFee] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("Credit Card");
//   const [finalPrice, setFinalPrice] = useState(Number(priceAfterApplyingCoupon) + shippingFee || 0);
//   const [address, setAddress] = useState({
//     fullName: "",
//     streetName: "",
//     city: "",
//     country: "",
//     postalCode: "",
//   });
//   const [clientSecret, setClientSecret] = useState(null);

//   useEffect(() => {
//     if (isAuthenticated) {
//       dispatch(getMyCart());
//     }
//   }, [dispatch, isAuthenticated]);

//   // Set shipping fee based on payment method
//   useEffect(() => {
//     setShippingFee(paymentMethod === "Cash on Delivery" ? 60 : 0); // COD shipping fee
//   }, [paymentMethod]);

//   // Recalculate final price whenever subtotal or shipping fee changes
//   useEffect(() => {
//     const updatedFinalPrice = Number(priceAfterApplyingCoupon) + shippingFee;
//     setFinalPrice(updatedFinalPrice);
//   }, [priceAfterApplyingCoupon, shippingFee]);

//   // Create Order first, then fetch client secret for payment
//   const handleCreateOrder = async () => {
//     const orderData = {
//       userId,
//       products: cartItems,
//       address,
//       paymentMethod,
//       discountCode: selectedCoupon.code || "",
//     };

//     try {
//       // Step 1: Create the order
//       const orderResponse = await dispatch(createNewOrder(orderData));
//       const orderId = orderResponse.orderId;  // Assuming orderResponse contains the orderId

//       // Now, fetch the client secret for Stripe payment
//       if (paymentMethod === "Credit Card") {
//         const amountInPaise = Math.round(finalPrice * 100); // Convert finalPrice to paise (INR)
//         if (amountInPaise < 5000) throw new Error("Amount must be at least ₹50");

//         const response = await axios.post("http://localhost:5000/create-payment-intent", {
//           amount: amountInPaise,
//           currency: "inr",
//         });

//         setClientSecret(response.data.clientSecret);
//         toast.success("Order created successfully. Please proceed with payment.");
//       }

//     } catch (error) {
//       toast.error("Failed to create order or fetch payment details.");
//       console.error(error.message);
//     }
//   };

//   // Handle payment submission
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmitPayment = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements || !clientSecret) return;

//     const cardElement = elements.getElement(CardElement);

//     const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: cardElement,
//       },
//     });

//     if (error) {
//       toast.error(error.message);
//     } else if (paymentIntent.status === "succeeded") {
//       toast.success("Payment successful");
//       // Step 2: Update the order status to 'paid'
//       await updateOrderPaymentStatus(paymentIntent.id, 'paid');
//       navigate("/ordersuccess", {
//         state: {
//           orderId: paymentIntent.metadata.orderId,
//           totalPrice: finalPrice,
//           items: cartItems,
//           shippingAddress: address,
//         },
//       });
//       dispatch(clearMyCart());
//     }
//   };

//   // Update the order's payment status
//   const updateOrderPaymentStatus = async (paymentId, status) => {
//     try {
//       await axios.put(`http://localhost:5000/orders/update-payment-status`, {
//         paymentId,
//         status,
//         orderId: paymentIntent.metadata.orderId,  // Pass orderId to update the order status
//       });
//     } catch (error) {
//       console.error("Failed to update payment status:", error.message);
//       toast.error("Payment status update failed.");
//     }
//   };

//   return (
//     <div className="place-order-container">
//       <div className="place-order-wrapper">
//         <div className="place-order-wrapper__left">
//           <h3>Shipping Info</h3>
//           <ShippingAddress address={address} setAddress={setAddress} />

//           <div className="order-items-wrapper">
//             <h3>Order Items (No of Items: {cartItems.reduce((acc, item) => acc + item.count, 0)})</h3>
//             {cartItems?.map((item, index) => (
//               <div key={index}>
//                 <span>{item.name}</span>
//                 <span>Quantity: {item.count}</span>
//                 <span>Price: ₹{item.total}</span>
//               </div>
//             ))}
//           </div>

//           <div className="payment-wrapper">
//             <h3>Choose Payment Method</h3>
//             <select
//               className="payment-method"
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             >
//               <option value="Cash on Delivery">Cash on Delivery</option>
//               <option value="Credit Card">Credit Card</option>
//             </select>
//           </div>

//           {paymentMethod === "Credit Card" && (
//             <form onSubmit={handleSubmitPayment}>
//               <CardElement />
//               <button type="submit" disabled={!stripe}>Pay Now</button>
//             </form>
//           )}
//         </div>

//         <div className="place-order-wrapper__right">
//           <h3>Order Summary</h3>
//           <div>
//             <span>Total Price:</span>
//             <span> ₹{subTotal.toFixed(2)}</span>
//           </div>
//           <div>
//             <span>Shipping Charge:</span>
//             <span> ₹{shippingFee}</span>
//           </div>
//           <div>
//             <span>Coupon Applied:</span>
//             <span>{selectedCoupon.discount > 0 ? selectedCoupon.code : "NIL"}</span>
//           </div>
//           <div>
//             <span>Final Price:</span>
//             <span> ₹{finalPrice.toFixed(2)}</span>
//           </div>

//           <button
//             disabled={loadingCart}
//             onClick={handleCreateOrder}
//             className="place-order-btn"
//           >
//             Create Order & Proceed to Payment
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlaceOrder;

