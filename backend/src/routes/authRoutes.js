import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logoutUser,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth.controller.js";
import { loginRateLimiter } from "../middlewares/rateLimiter.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginRateLimiter, loginUser);
router.get("/verify-email",  verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

router.get("/profile", verifyToken, getProfile);

router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/logout", logoutUser);

export default router;
