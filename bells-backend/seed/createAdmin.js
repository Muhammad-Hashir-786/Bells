import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { Admin } from "../models/Admin.js";
import mongoose from "mongoose";

dotenv.config();
const run = async () => {
    await connectDB();
    
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log("Usage: node seed/createAdmin.js you@email.com yourPassword");
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin already exists with that email.");
    process.exit(1);
  }

  await Admin.create({ email, password });
  console.log(`Admin created: ${email}`);
  process.exit(0);
};

run();