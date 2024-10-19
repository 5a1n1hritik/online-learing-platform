import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Middleware for validating input fields
const validateRegisterInput = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }
  next();
};

const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  next();
};

// Route to register a new user
router.post("/register", validateRegisterInput, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash the password and create the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user" });
  }
});

// Route to log in a user
router.post("/login", validateLoginInput, async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Generated token:", token);

    // Set the JWT token as an HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      // sameSite: 'Strict',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "An error occurred while logging in" });
  }
});

// Route to log out a user
router.post("/logout", (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: "Logged out successfully" });
});

export default router;
