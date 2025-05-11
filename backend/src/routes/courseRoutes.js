import express from "express";
import {
  createCourse,
  deleteCourse,
  enrollInCourse,
  getAllCourses,
  getCourseDetails,
  getEnrolledCourses,
  getInstructorCourses,
  getInstructorCoursesById,
  updateCourse,
} from "../controllers/course.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createCourse); // Instructors only
router.get("/all-courses", getAllCourses); // Public: all courses
router.get("/:id", getCourseDetails); // Public: course details
router.put("/update/:id", verifyToken, updateCourse); // Instructors only
router.delete("/delete/:id", verifyToken, deleteCourse); // Instructors only
router.post("/enroll/:id", verifyToken, enrollInCourse); // Students enroll
router.get("/my-courses", verifyToken, getEnrolledCourses); // View enrolled
router.get("/my-courses/:id", verifyToken, getEnrolledCourses); // View enrolled courses by ID
// router.get("/my-courses/:id/details", verifyToken, getCourseDetails); // View enrolled course details by ID
router.get("/instructor", verifyToken, getInstructorCourses); // View instructor courses by ID
router.get("/instructor/:id", verifyToken, getInstructorCoursesById); // View instructor courses by ID

export default router;
