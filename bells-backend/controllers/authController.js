import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(admin._id);

  res.cookie("token", token, {
    httpOnly: true,                                  // JS on the page can't read it — blocks XSS token theft
    secure: process.env.NODE_ENV === "production",    // HTTPS only in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,                  // 7 days, matches JWT expiry
  });

  res.status(200).json({ message: "Logged in", admin: { email: admin.email } });
}

// POST /api/auth/logout
export function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
}

// GET /api/auth/me — lets the frontend check "am I still logged in?" on page load
export async function getMe(req, res) {
  const admin = await Admin.findById(req.adminId).select("-password");
  res.status(200).json({ admin });
}