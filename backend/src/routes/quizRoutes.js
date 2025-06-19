import express from "express";
import {
  addQuestionToQuiz,
  createQuiz,
  deleteQuiz,
  getAllQuizzes,
  getQuizByCourse,
  getQuizById,
  getQuizQuestions,
  getUserQuizResult,
  submitQuiz,
  updateQuiz,
} from "../controllers/quiz.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/new", verifyToken, createQuiz);
router.get("/", getAllQuizzes);
router.get("/quizzes/:id", getQuizById);
router.put("/quizzes/:id", verifyToken, updateQuiz);
router.delete("/quizzes/:id", verifyToken, deleteQuiz);

router.get("/course/:courseId",verifyToken, getQuizByCourse);

router.post("/:quizId/questions", verifyToken, addQuestionToQuiz);
router.get("/:quizId/questions", verifyToken, getQuizQuestions);

router.post("/:quizId/submit", verifyToken, submitQuiz);
router.get("/:quizId/result/:userId", verifyToken, getUserQuizResult);

export default router;
