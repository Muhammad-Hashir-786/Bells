import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userAuthRoutes from "./routes/userAuthRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

// CORS_ORIGIN can be a single URL or a comma-separated list (e.g. for a
// staging + production frontend). Falls back to the local Vite dev server
// so `npm run dev` keeps working with no .env changes.
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (curl, server-to-server, some mobile clients)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());        // ← must come BEFORE routes that read req.body
app.use("/api/auth", authRoutes);
app.use("/api/auth/user", userAuthRoutes);

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Bells API is running" });
});
app.use("/api/orders", orderRoutes);
app.use("/api", productRoutes);

// 404 handler — runs if no route above matched the request
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler — must be defined LAST, and must take 4 arguments
// (req, res, next as well as err) or Express won't recognize it as an error handler.
// Any thrown error or rejected promise from the routes above ends up here.
app.use((err, req, res, next) => {
  console.error(err);

  // Mongoose validation errors (e.g. missing required field, bad enum value)
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  // Duplicate key error (e.g. slug already exists, since it's marked unique)
  if (err.code === 11000) {
    return res.status(409).json({ message: "A product with that slug already exists" });
  }

  res.status(err.status || 500).json({ message: err.message || "Something went wrong" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bells API running on http://localhost:${PORT}`);
});
