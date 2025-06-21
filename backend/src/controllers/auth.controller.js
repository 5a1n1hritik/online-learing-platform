import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { loginSchema, registerSchema } from "../validators/authValidator.js";
import { sendVerificationEmail } from "../utils/emailService.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const registerUser = async (req, res) => {
  try {
    // const csrfToken = req.csrfToken();  // Generate CSRF token

    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: Role.STUDENT },
    });

    // Generate email verification token
    const emailToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_EMAIL_SECRET,
      { expiresIn: "24h" }
    );

    // Send verification email
    await sendVerificationEmail(email, name, emailToken);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      // csrfToken, // Send CSRF token in response
    });
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email already registered" });
    }
    if (error.name === "ZodError") {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    // const csrfToken = req.csrfToken();

    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    // Tokens
    const accessToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    ); // short
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    ); // long

    // Save refresh token in database (optional)
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Set Refresh Token in HttpOnly Secure Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "Strict", // or 'Lax'
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      // csrfToken, // Send CSRF token in response
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: "Token missing" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    const userId = decoded.userId;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update user's email verification status
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const emailToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_EMAIL_SECRET,
      { expiresIn: "24h" }
    );

    await sendVerificationEmail(user.email, user.name, emailToken);

    return res.status(200).json({ message: "Verification email resent" });
  } catch (err) {
    console.error("Resend failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Refresh token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Check if token exists in DB
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logoutUser = async (req, res) => {
  const token = req.cookies.refreshToken;
  try {
    if (token) {
      await prisma.refreshToken.deleteMany({ where: { token } });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during logout" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        // Optionally, include related counts or summaries if needed:
        // courses: true,
        // quizSubmissions: { select: { id: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Send Reset Link (simulate email)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token and expiry
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 min expiry
      },
    });

    const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;

    // TODO: send email with resetUrl (for now just simulate)
    console.log(`Reset Link (send this via email): ${resetUrl}`);

    res.status(200).json({ message: "Reset password link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) return res.status(400).json({ message: "Token missing" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear resetToken fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
