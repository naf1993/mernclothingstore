// OrderSuccess.js
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Headings from "../components/Headings"; // Import your heading component


const OrderSuccess = () => {
  const location = useLocation(); // Get the location object
  const navigate = useNavigate(); // For navigation

  // Get state passed through navigation (order details)
  const { orderId, totalPrice, items, shippingAddress } = location.state || {}; 

  // If no orderId is passed, redirect to home or show an error
  if (!orderId) {
    navigate("/"); // Redirect to the homepage if there's no order ID
  }

  return (
    <div className="order-success-container">
      <div className="order-success-wrapper">
        <Headings>Your Order Has Been Placed Successfully!</Headings>

        <div className="order-summary">
          <p>Thank you for your purchase. Your order has been successfully placed!</p>

          <div className="order-details">
            <div>
              <strong>Order ID:</strong> <span>{orderId}</span>
            </div>
            <div>
              <strong>Total Price:</strong> <span>${totalPrice}</span>
            </div>

            {items && (
              <div>
                <strong>Items Ordered:</strong>
                <ul>
                  {items.map((item) => (
                    <li key={item.productId}>
                      {item.name} - {item.count} x ${item.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {shippingAddress && (
              <div>
                <strong>Shipping Address:</strong>
                <p>{shippingAddress.fullName}</p>
                <p>{shippingAddress.streetName}</p>
                <p>{shippingAddress.city}, {shippingAddress.country}</p>
                <p>Postal Code: {shippingAddress.postalCode}</p>
              </div>
            )}
          </div>
        </div> 

         <div className="order-actions">
          <button onClick={() => navigate("/")}>Go to Homepage</button>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
