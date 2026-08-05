import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "An account with that email already exists" });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.cookie("userToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "Account created",
    user: { id: user._id, name: user.name, email: user.email },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user._id);

  res.cookie("userToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Logged in",
    user: { id: user._id, name: user.name, email: user.email },
  });
}

export function logout(req, res) {
  res.clearCookie("userToken");
  res.status(200).json({ message: "Logged out" });
}

export async function getMe(req, res) {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ user });
}


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export async function googleLogin(req, res) {
  const { credential } = req.body; // the ID token sent from the frontend

  if (!credential) {
    return res.status(400).json({ message: "Missing Google credential" });
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Google token" });
  }

  const { sub: googleId, email, name } = payload;

  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user && !user.googleId) {
    // existing email/password account — link the Google ID to it
    user.googleId = googleId;
    await user.save();
  } else if (!user) {
    // brand new account, no password needed
    user = await User.create({ name, email, googleId });
  }

  const token = generateToken(user._id);

  res.cookie("userToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Logged in with Google",
    user: { id: user._id, name: user.name, email: user.email },
  });
}