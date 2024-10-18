const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// const registerUser = async (req, res) => {
router.post('/enrollCourse',async(req, res) => {
    const { userId, courseId } = req.body;
  try {
    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId }
    });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Enrollment failed' });
  }
});

// const loginUser = async (req, res) => {
router.get('/user/:userId',async(req, res) => {
    const { userId } = req.params;
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: parseInt(userId) },
      include: { Course: true }
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrolled courses' });
  }
});

module.exports = router;
