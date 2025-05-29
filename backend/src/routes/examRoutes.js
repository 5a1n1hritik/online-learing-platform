import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { addQuestionToExam, createExam, getAllExams, getExamDetails } from "../controllers/exam.controller.js";


const router = express.Router();

router.post('/',  createExam);
router.post('/:examId/questions',  addQuestionToExam);
router.get('/details/:examId',  getExamDetails);
router.get('/',  getAllExams);


export default router;