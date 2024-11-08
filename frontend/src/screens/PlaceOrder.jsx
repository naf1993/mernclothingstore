import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation()
  const {finalPrice:priceAfterApplyingCoupon = 0,selectedCoupon = {}} = location.state || {}
console.log('final and disocunt from cart page',priceAfterApplyingCoupon,selectedCoupon)
  const user = useSelector((state) => state.user);
  const {
    products: cartItems,
    subTotal,
    loading: loadingCart,
    error: errorCart,
  } = useSelector((state) => state.cart);

  const { isAuthenticated } = user;
  // const { order, loading, error } = useSelector((state) => state.order);

  const [shippingFee, setShippingFee] = useState(0); 
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [finalPrice, setFinalPrice] = useState(Number(priceAfterApplyingCoupon) + shippingFee || 0);

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
    const updatedFinalPrice = (Number(priceAfterApplyingCoupon) + shippingFee).toFixed(2);
    setFinalPrice(parseFloat(updatedFinalPrice));
  }, [priceAfterApplyingCoupon, shippingFee]);


  const handlePlaceOrder = () => {
    const orderData = {
      products: cartItems,
      paymentMethod,
      totalPrice: subTotal,
      shippingFee,
      finalPrice,
      address,
    };
    console.log(orderData)
    //dispatch(createNewOrder(orderData)); // Dispatch the action to create the order
  };

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
      <div className="place-order-wrapper">
        <div className="place-order-wrapper__left">
          <h3>Shipping Info</h3>
          <ShippingAddress address={address} setAddress={setAddress} />
          <div className="order-items-wrapper">
            <h3>
              Order Items (No of Items is{" "}
              {cartItems.reduce((acc, it) => acc + it.count, 0)})
            </h3>

            {cartItems?.map((item,index) => (
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
            {selectedCoupon.discount > 0 && (<span>{selectedCoupon.code}</span>)}
           {selectedCoupon.discount < 0 && (<span>NIL</span>)}
          </div>
          <div>
            <span>Final Price:</span>
            <span> ${finalPrice.toFixed(2)}</span>
          </div>

          <button onClick={handlePlaceOrder} className="place-order-btn">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
