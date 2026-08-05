import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { Product } from "../models/Product.js";
import { seedProducts } from "./seedData.js";

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Bells";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB, seeding...");

  await Product.deleteMany({});
  const inserted = await Product.insertMany(seedProducts);

  console.log(`Seeded ${inserted.length} products.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
