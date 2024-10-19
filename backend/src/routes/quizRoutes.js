import express from 'express';
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/lesson/:lessonId", async (req, res) => {
  const { lessonId } = req.params;
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { lessonId: parseInt(lessonId) },
    });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
});

router.post("/submit", async (req, res) => {
  const { quizId, userAnswer } = req.body;
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
    });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const isCorrect = quiz.correctAnswer === userAnswer;
    res.json({ isCorrect });
  } catch (error) {
    res.status(500).json({ message: "Quiz submission failed" });
  }
});

export default router;
