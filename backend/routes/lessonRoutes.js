const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/course/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId: parseInt(courseId) },
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
    });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lesson details" });
  }
});

module.exports = router;
