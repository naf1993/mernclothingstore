import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyOrderDetails } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Order ID from URL params
  const { order, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getMyOrderDetails(id)); // Fetch order details by ID
  }, [dispatch, id]);

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  if (loading) return <Loader />;
  if (error) return <Message error={error} />;
  return (
    <div className="page-wrapper">
      <div className="order-detail-wrapper">
        <h2>Order #{order.orderId}</h2>

        {/* Order Header */}
        <div className="order-header">
          <div>
            <h4>Status:</h4>
            <span className={`status ${order.paymentStatus.toLowerCase()}`}>
              {order.paymentStatus}
            </span>
          </div>
          <div>
            <h4>Order Status:</h4>
            <span className={`status ${order.orderStatus.toLowerCase()}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="shipping-info">
          <h3>Shipping Information</h3>
          <p>
            <strong>Name:</strong> {order.address.fullName}
          </p>
          <p>
            <strong>Address:</strong> {order.address.streetName}
          </p>
          <p>
            <strong>City:</strong> {order.address.city}
          </p>
          <p>
            <strong>Country:</strong> {order.address.country}
          </p>
          <p>
            <strong>Postal Code:</strong>{" "}
            {order.address.postalCode || "Not available"}
          </p>
        </div>

        {/* Order Items */}
        <div className="order-items">
          <h3>Order Items</h3>
          {order.products.map((item) => (
            <div key={item._id} className="order-item">
              <img src={item.productId.images[0]} alt={item.productId.name} />
              <div className="item-details">
                <p>{item.productId.name}</p>
                <p>Qty: {item.count}</p>
                <p>Price: {formatCurrency(item.price)}</p>
                <p>Total: {formatCurrency(item.total)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>
            <strong>Items Total:</strong> {formatCurrency(order.totalPrice)}
          </p>
          <p>
            <strong>Discount:</strong> -{formatCurrency(order.discount)}
          </p>
          <p>
            <strong>Shipping Fee:</strong> {formatCurrency(order.shippingFee)}
          </p>
          <p>
            <strong>Final Price:</strong> {formatCurrency(order.finalPrice)}
          </p>
        </div>

        {/* Payment Information */}
        <div className="payment-method">
          <h3>Payment Method</h3>
          <p>{order.paymentMethod}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
