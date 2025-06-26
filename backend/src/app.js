import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import csurf from "csurf";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import examPaper from "./routes/examPaper.js";

const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:5174",
];

// Middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, 
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

// -------- ROUTES --------

// User Routes
// Instructor Routes

// Admin Routes
import adminUserRoutes from "./routes/admin/userRoutes.js";
import adminCourseRoutes from "./routes/admin/courseRoutes.js";
import adminCategoryRoutes from "./routes/admin/categoryRoutes.js";
import adminQuizRoutes from "./routes/admin/quizRoutes.js";
// import adminExamRoutes from "./routes/admin/examRoutes.js";

app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/courses", adminCourseRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/quizzes", adminQuizRoutes);
// app.use("/api/admin/exams", adminExamRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exampaper", examPaper);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

export default app;
