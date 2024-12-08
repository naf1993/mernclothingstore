// OrderSuccess.js
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Headings from "../components/Headings"; // Import your heading component
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";

const OrderSuccess = () => {
  const location = useLocation(); // Get the location object
  const navigate = useNavigate(); // For navigation

  // Get state passed through navigation (order details)
  // const { orderId, totalPrice, items, shippingAddress } = location.state || {};
  // console.log(orderId,totalPrice)
  const {
    order: placedOrder,
    error,
    loading,
  } = useSelector((state) => state.order);

 

  return (
    <div className="page-container">
      <div className="order-success-container">
        {loading && <Loader />}
        {error && <Message error={error} />}
        {placedOrder && (
          <>
            <h3>Your Order Has Been Placed Successfully!</h3>

            <div className="order-summary">
              <p>
                Thank you for your purchase. Your order has been successfully
                placed!
              </p>

              <div className="order-details">
                <div>
                  <strong>Order ID:</strong> <span>{placedOrder.orderId}</span>
                </div>
                <div>
                  <strong>Total Price:</strong> <span>₹{placedOrder.finalPrice}</span>
                </div>

                {placedOrder?.products && (
                  <div>
                    <strong>Items Ordered:</strong>
                    <ul>
                      {placedOrder?.products?.map((item) => (
                        <li key={item.productId}>
                          {item.name} - {item.count} x ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {placedOrder.address && (
                  <div>
                    <strong>Shipping Address:</strong>
                    <p>{placedOrder?.address.fullName}</p>
                    <p>{placedOrder?.address.streetName}</p>
                    <p>
                      {placedOrder?.address.city}, {placedOrder?.address.country}
                    </p>
                    <p>Postal Code: {placedOrder?.address.postalCode}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="order-actions">
              <button onClick={() => navigate("/")}>Continue Shopping</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;
