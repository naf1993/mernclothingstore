import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyOrder } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import EmptyMessage from "../components/EmptyMessage";
const statusColorMapping = {
  paymentStatus: {
    Pending: "#FFCC00", /// Yellow
    Paid: "#4CAF50", // Green
    Failed: "#F44336", // Red
  },
  orderStatus: {
    "Not Processed": "#FFC107", // Amber
    Processing: "#2196F3", // Blue
    Shipped: "#FF9800", // Orange
    Delivered: "#8BC34A", // Light Green
    Cancelled: "#F44336",
  },
};

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(getMyOrder());
  }, [dispatch]);

  return (
    <div className="page-container">
      <div className="orders-wrapper">
        <h3>My Orders</h3>
        {loading && <Loader />}
        {error && <Message error={error} />}
        {orders.length === 0 && (
          <EmptyMessage message="You have no orders yet" />
        )}
        <div className="orders-list">
          {orders &&
            orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div>
                  <h4>Order No:</h4>
                  <span className="orderno">{order.orderId}</span>
                </div>
                <div>
                  <h6>Payment Status</h6>
                  <span
                    style={{
                      backgroundColor:
                        statusColorMapping.paymentStatus[order.paymentStatus] ||
                        "#f0f0f0", // Default color if status is not found
                      padding: "0.3rem 0.6rem",
                      borderRadius: "5px",
                      color: "#fff", // Ensure text is readable on colored backgrounds
                    }}
                    className="status"
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <div>
                  <h6>Order Status:</h6>
                  <span
                    style={{
                      backgroundColor:
                        statusColorMapping.orderStatus[order.orderStatus] ||
                        "#f0f0f0", // Default color if status is not found
                      padding: "0.3rem 0.6rem",
                      borderRadius: "5px",
                      color: "#fff", // Ensure text is readable on colored backgrounds
                    }}
                    className="status"
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <p>Final Price:{order.finalPrice}</p>

                <Link
                  to={`/orders/${order._id}`}
                  className="view-details-button"
                >
                  View Details
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
