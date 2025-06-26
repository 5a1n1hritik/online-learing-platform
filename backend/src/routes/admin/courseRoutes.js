import express from "express";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseDetails,
  toggleCourseStatus,
  updateCourse,
} from "../../controllers/admin/course.controller.js";

const router = express.Router();

// managing courses
router.post("/create", verifyAdmin, createCourse);
router.get("/all-courses", verifyAdmin, getAllCourses);
router.get("/:courseId", verifyAdmin, getCourseDetails);
router.put("/update-course/:courseId", verifyAdmin, updateCourse);
router.delete("/delete-course/:courseId", verifyAdmin, deleteCourse);
router.patch("/status/:courseId", verifyAdmin, toggleCourseStatus);

export default router;
