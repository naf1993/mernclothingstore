import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URL_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 60000, // 1 minute
      connectTimeoutMS: 60000, // 1 minute
      serverSelectionTimeoutMS: 60000, // 1 minute
      bufferCommands: false,
    });
    console.log(`Mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`error:${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
