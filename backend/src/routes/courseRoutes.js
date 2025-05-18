import express from "express";
import {
  createCourse,
  deleteCourse,
  enrollInCourse,
  getAllCourses,
  getCourseDetails,
  getCourseProgress,
  getEnrolledCourses,
  getInstructorCourses,
  getInstructorCoursesById,
  submitReview,
  unenrollFromCourse,
  updateCourse,
} from "../controllers/course.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createCourse); 
router.get("/all-courses", getAllCourses); 
router.get("/:id", getCourseDetails); 
router.put("/update/:id", verifyToken, updateCourse); 
router.delete("/delete/:id", verifyToken, deleteCourse); 

router.post("/enroll/:id", verifyToken, enrollInCourse); 
router.delete("/:id/unenroll", verifyToken, unenrollFromCourse); 
router.post("/:id/review", verifyToken, submitReview); 
router.get("/:id/progress", verifyToken, getCourseProgress); 
router.post("/:id/progress", verifyToken, getCourseProgress); 

router.get("/my-courses", verifyToken, getEnrolledCourses); 
router.get("/my-courses/:id", verifyToken, getEnrolledCourses); 
router.get("/instructor", verifyToken, getInstructorCourses); 
router.get("/instructor/:id", verifyToken, getInstructorCoursesById); 

export default router;
