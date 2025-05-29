import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { addQuestionToPaper, createExamPaper } from "../controllers/examPaper.Controller.js";

const router = express.Router();

router.post('/paper', createExamPaper);
router.post('/:paperId/questions',  addQuestionToPaper);


export default router;