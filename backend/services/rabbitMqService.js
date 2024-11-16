import { connectRabbitMQ } from "../config/rabbitmqConfig.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js"; // Fixed model import for Order
import Notification from "../models/notificationModel.js";

// Function to send messages to RabbitMQ
const sendToQueue = async (message) => {
  try {
    const { channel } = await connectRabbitMQ();
    console.log("Sending message to queue:", message);
    await channel.assertQueue("order_updates", { durable: true });
    console.log('Queue "order_updates" asserted.');
    channel.sendToQueue("order_updates", Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log("Sent to queue:", message);
  } catch (error) {
    console.error("Error sending message to queue:", error);
  }
};

// Function to consume messages from the queue
const consumeQueue = async () => {
  try {
    console.log("Starting to consume messages...");
    const { channel } = await connectRabbitMQ(); // Reuse the existing connection/channel

    await channel.assertQueue("order_updates", { durable: true });
    console.log('Queue "order_updates" asserted.');

    // Listen for messages from the queue
    channel.consume("order_updates", async (msg) => {
      if (msg !== null) {
        const order = JSON.parse(msg.content.toString());
        console.log("Received order:", order);

        try {
          await processOrder(order); // Process the order
          channel.ack(msg); // Acknowledge the message after processing
        } catch (err) {
          console.error("Error processing order:", err);
          // Nack the message to requeue it for later
          channel.nack(msg, false, true); // Requeue the message in case of an error
        }
      }
    });

    console.log("Waiting for messages...");
  } catch (error) {
    console.error("Error consuming messages from RabbitMQ:", error);
  }
};

const processOrder = async (receivedOrder) => {
  try {
    // Extract the order details from the 'order' field
    const order = receivedOrder.order;

    console.log("this is payment method", order.paymentMethod);
    console.log("this is payment status", order.paymentStatus);
    console.log("this is order status", order.orderStatus);
    // Check if the payment method is "Cash on Delivery"
    const statusUpdate =
      order.paymentMethod === "Cash on Delivery"
        ? { paymentStatus: "Pending", orderStatus: "Processing" }
        : { paymentStatus: "Paid", orderStatus: "Processing" };

    // Update the order with the new payment status and order status
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: order.orderId }, // Use orderId from the 'order' object
      { $set: statusUpdate },
      { new: true, upsert: false, runValidators: true }
    );

    // If no order is found with the given orderId, log an error
    if (!updatedOrder) {
      console.log(`Failed to update order with ID: ${order.orderId}`);
    }

    // Process the products in the received order
    for (const item of receivedOrder.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.countInStock -= item.count;
        await product.save(); // Ensure product stock is updated
      }
    }

    // Send a notification to the user
    const notification = new Notification({
      user: order.user, // Ensure you're using the 'user' from the 'order' object
      message: `${receivedOrder.user.name} placed an order`,
      type: "user_ordered",
    });
    await notification.save();
  } catch (error) {
    console.error("Error processing order:", error);
    // Retry logic or better error handling can be added here if necessary
  }
};

export { sendToQueue, consumeQueue };
