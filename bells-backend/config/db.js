import mongoose from "mongoose";

// Reads the connection string from .env (MONGO_URI) instead of hardcoding it.
// Falls back to a sane local default so the app still runs if .env is missing.
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Bells";

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
