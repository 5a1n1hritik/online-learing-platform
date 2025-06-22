import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  refreshAccessToken,
  logoutUser,
  resendOtponEmail,
  verifyOtp,
  verifyResetPasswordOtp,
  requestPasswordResetOtp,
} from "../controllers/auth.controller.js";
import { loginRateLimiter } from "../middlewares/rateLimiter.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginRateLimiter, loginUser);
router.post("/resend-otp", resendOtponEmail);
router.post("/verify-otp", verifyOtp);

router.get("/profile", verifyToken, getProfile);

router.post("/refresh-token", refreshAccessToken);
router.post("/request-password-reset-otp", requestPasswordResetOtp);
router.post("/verify-reset-password-otp", verifyResetPasswordOtp);

router.post("/logout", logoutUser);

export default router;
