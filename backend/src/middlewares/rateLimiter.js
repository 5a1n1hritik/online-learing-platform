import rateLimit from 'express-rate-limit';

// Limit login attempts
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per user
  keyGenerator: (req) => req.body.username || req.body.email, // Use username or email as the unique key
  message: 'Too many login attempts, please try again later.'
});
