import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { addQuestionToExam, checkExamAttempt, createExam, getAllExams, getCourseExams, getExamDetails, startExam, submitExam } from "../controllers/exam.controller.js";


const router = express.Router();

router.post('/',  createExam);
router.post('/:examId/questions',  addQuestionToExam);
router.get('/details/:examId',  getExamDetails);
router.get('/',  getAllExams);
router.get('/courses/:courseId/exams',  getCourseExams);
router.get('/:examId/check-attempt', verifyToken, checkExamAttempt);
router.post('/:examId/start',verifyToken, startExam);
router.post('/:examId/submit',verifyToken, submitExam);


export default router;