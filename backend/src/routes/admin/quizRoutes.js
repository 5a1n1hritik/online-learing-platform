import express from "express";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import {
  addQuestionToQuiz,
  createQuiz,
  deleteQuiz,
  getAllQuizzes,
  getQuizById,
  getQuizQuestions,
  updateQuiz,
} from "../../controllers/admin/quiz.controller.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

const router = express.Router();

// managing quizzes
router.post("/create", verifyAdmin, createQuiz);
router.put("/update-quiz/:quizId", verifyAdmin, updateQuiz);
router.delete("/delete-quiz/:quizId", verifyAdmin, deleteQuiz);

router.post(
  "/add-questions/:quizId",
  uploadToCloudinary.single("image"),
  verifyAdmin,
  addQuestionToQuiz
);

router.get("/all-quizzes", verifyAdmin, getAllQuizzes);
router.get("/details/:quizId", verifyAdmin, getQuizById);
router.get("/all-questions/:quizId", verifyAdmin, getQuizQuestions);

export default router;
