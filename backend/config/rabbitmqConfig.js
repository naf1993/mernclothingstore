// backend/config/rabbitmqConfig.js
import dotenv from "dotenv";
dotenv.config();
import amqp from "amqplib";

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    console.log('trying to connect')
    if (connection && channel) {
      // Return existing connection and channel if already created
      return { connection, channel };
    }
    let aws_rabbitmq_url = process.env.RABBITMQ_URL_PRODUCTION


    let url =
      process.env.NODE_ENV === "production"
        ? aws_rabbitmq_url
        : process.env.RABBITMQ_URL_LOCAL;
    // Connect to RabbitMQ server
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    console.log('rabbit mq url',url)
  

    // Assert the queue exists and is durable
    await channel.assertQueue("order_updates", { durable: true });

    console.log("Connected to RabbitMQ");

    // Handle graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Closing RabbitMQ connection...");
      await closeRabbitMQ();
      process.exit(0);
    });

    return { connection, channel };
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
};

// Close RabbitMQ connection and channel gracefully
const closeRabbitMQ = async () => {
  try {
    if (channel) {
      await channel.close();
      console.log("RabbitMQ channel closed");
    }
    if (connection) {
      await connection.close();
      console.log("RabbitMQ connection closed");
    }
  } catch (error) {
    console.error("Error closing RabbitMQ:", error);
  }
};

export { connectRabbitMQ, closeRabbitMQ };
