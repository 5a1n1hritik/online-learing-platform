import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import csurf from "csurf";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import examPaper from "./routes/examPaper.js";

dotenv.config();

const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:5174",
];

const app = express();

// Middlewares
app.use(cookieParser());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // important if you use cookies/session
  })
);

app.use(express.json());

// CSRF protection
// app.use(csurf({ cookie: true }));

// Handle CSRF token errors
// app.use((err, req, res, next) => {
//   if (err.code === "EBADCSRFTOKEN") {
//     res.status(403).json({ message: "Invalid CSRF token" });
//   } else {
//     next(err);
//   }
// });

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exampaper", examPaper);

export default app;
