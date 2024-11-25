import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyOrder } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import EmptyMessage from "../components/EmptyMessage";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
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

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(getMyOrder());
  }, [dispatch]);
  const [openOrderIndex, setOpenOrderIndex] = useState(null);
  const detailsRefs = useRef([]);

  const handleAccordionToggle = (index) => {
    setOpenOrderIndex(openOrderIndex === index ? null : index);
    const isOpen = openOrderIndex === index;
    gsap.to(detailsRefs.current[index], {
      height: isOpen ? 0 : "auto",
      opacity: isOpen ? 0 : 1,
      duration: 0.5,
      ease: "power2.out",
    });
  };
const handleReturn = (productId,orderId) => {
  console.log(productId)
  console.log(orderId)
}
const handleCancel = (orderId)=>{
  console.log(orderId)
}
  //const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
  return (
    <div className="page-container">
      <div className="orders-wrapper">
        <h3>My Orders</h3>
        {loading && <Loader />}
        {error && <Message error={error} />}
        {orders.length === 0 && (
          <EmptyMessage message="You have no orders yet" />
        )}

        {orders &&
          orders.map((order, index) => (
            <div className="order" key={index}>
              <div
                className="order-header"
                onClick={() => handleAccordionToggle(index)}
              >
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
                      padding: "0.4rem 0.7rem",
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
                      padding: "0.4rem 0.7rem",
                      borderRadius: "5px",
                      color: "#fff", // Ensure text is readable on colored backgrounds
                    }}
                    className="status"
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <p>Final Price:₹{order.finalPrice}</p>
                <div className="updownicon">
                  {" "}
                  {openOrderIndex === index && (
                    <AiOutlineArrowUp className="icon"/>
                  )}
                  {openOrderIndex !== index && (
                    <AiOutlineArrowDown className="icon" />
                  )}
                </div>
              </div>
              <div
                className="order-details"
                style={{ height: 0, opacity: 0 }}
                ref={(el) => (detailsRefs.current[index] = el)}
              >
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
                </div>{" "}
                <div className="order-items">
                  <h3>Order Items</h3>
                  {order.products.map((item) => (
                    <div key={item._id} className="order-item">
                      <div className="item-details">
                        <p>{item.productId.name}</p>
                        <p>Qty: {item.count}</p>
                        <p>Total: ₹{item.total}</p>
                        {order.paymentStatus === 'Paid' && order.orderStatus === 'Delivered' && (<button className="return-btn" onClick={()=>handleReturn(item._id,order.orderId)}>Return Product</button>)}
                        
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <p>
                    <strong>Items Total:</strong>{" "}
                    ₹{order.totalPrice}
                  </p>
                  <p>
                    <strong>Discount:</strong> -{order.discount}
                  </p>
                  <p>
                    <strong>Shipping Fee:</strong>{" "}
                    ₹{order.shippingFee}
                  </p>
                  <p>
                    <strong>Final Price:</strong>{" "}
                    ₹{order.finalPrice}
                  </p>
                </div>
                <div className="payment-method">
                  <h3>Payment Method</h3>
                  <p>{order.paymentMethod}</p>
                  {order.paymentStatus === 'Paid' && order.orderStatus === 'Delivered' && (<button className="cancel-btn" onClick={()=>handleCancel(order.orderId)}>Cancel Order</button>)}
                 
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrdersPage;
