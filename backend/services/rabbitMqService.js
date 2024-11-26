import { connectRabbitMQ } from "../config/rabbitmqConfig.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js"; // Fixed model import for Order
import Notification from "../models/notificationModel.js";
import { sendEmail } from "../utils/email.js";
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
    const order = receivedOrder.order;


    const statusUpdate =
      order.paymentMethod === "Cash on Delivery"
        ? { paymentStatus: "Pending", orderStatus: "Processing" }
        : { paymentStatus: "Paid", orderStatus: "Processing" };

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: order.orderId },
      { $set: statusUpdate },
      { new: true, upsert: false, runValidators: true }
    );

    if (!updatedOrder) {
      console.error(`Failed to update order with ID: ${order.orderId}`);
      
    } else {
      console.log(`Order with ID ${order.orderId} updated successfully.`);
      console.log('this is updated order')
      console.log(updatedOrder)
    }

    for (const item of receivedOrder.products) {
      console.log(`Processing product with ID: ${item.productId}`);
      const product = await Product.findById(item.productId);
      if (product) {
        product.countInStock -= item.count;
        await product.save();
        console.log(`Product with ID ${item.productId} updated successfully.`);
      } else {
        console.error(`Product with ID ${item.productId} not found.`);
      }
    }

    const notification = new Notification({
      user: order.user,
      message: `${receivedOrder.user.name} placed an order`,
      type: "user_ordered",
    });
    await notification.save();
    console.log("Notification created successfully.");
   const userEmail = 'haffis02@gmail.com'
    const subject = 'Order Confirmation';
    const textContent = `Your order #${order.orderId} has been confirmed. The total amount is ₹${totalAmount}.`;
    const htmlContent = `<strong>Order Confirmation</strong><br>Your order #${order.orderId} has been confirmed.<br>The total amount is ₹${totalAmount}.`;
  
    await sendEmail({ userEmail, subject, textContent, htmlContent });
  } catch (error) {
    console.error("Error processing order:", error);
  }
};


export { sendToQueue, consumeQueue };
