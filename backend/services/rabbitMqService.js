import { connectRabbitMQ } from '../config/rabbitmqConfig.js';

const sendToQueue = async (message) => {
  try {
    const { channel } = await connectRabbitMQ(); // Reuse the existing connection/channel
    // Send message to the queue with persistence enabled
    channel.sendToQueue('order_updates', Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log('Sent to queue:', message);
  } catch (error) {
    console.error('Error sending message to queue:', error);
  }
};

const consumeQueue = async () => {
    try {
      const { channel } = await connectRabbitMQ(); // Reuse the existing connection/channel
  
      // Listen for messages from the queue
      channel.consume('order_updates', async (msg) => {
        if (msg !== null) {
          const order = JSON.parse(msg.content.toString());
          console.log('Received order:', order);
  
          // Example of processing the order:
          // - Update payment status
          // - Update stock
          // - Send Twilio message (order confirmation SMS)
          // - Send email via SendGrid (order confirmation)
  
          try {
            // Assume processOrder is a function that updates the payment status, stock, etc.
            await processOrder(order);
  
            // Acknowledge the message after processing
            channel.ack(msg);
          } catch (err) {
            console.error('Error processing order:', err);
            // If error occurs, don't acknowledge the message and it will be requeued
          }
        }
      });
  
      console.log('Waiting for messages...');
    } catch (error) {
      console.error('Error consuming messages from RabbitMQ:', error);
    }
  };
  
  const processOrder = async (order) => {
    // Example processing: Update payment status, stock, and send confirmation
    console.log('Processing order:', order);
  
    // Payment status update, stock update, sending emails/SMS, etc.
    // Add the appropriate logic for each step.
  };

export { sendToQueue,consumeQueue };