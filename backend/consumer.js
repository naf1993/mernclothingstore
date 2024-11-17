//backend/consumer.js

import connectDB from './config/db.js';  // Import the MongoDB connection function
import { consumeQueue } from './services/rabbitMqService.js';

const startConsumer = async () => {
  try {
    await connectDB();  // Ensure MongoDB is connected
    consumeQueue();     // Start consuming messages from RabbitMQ
  } catch (error) {
    console.error('Error starting consumer:', error);
  }
};

startConsumer();  // Start the consumer script
