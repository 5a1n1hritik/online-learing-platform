const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// const registerUser = async (req, res) => {
router.get('/allCourses',async(req, res) => {
    try {
        const courses = await prisma.course.findMany();
        res.json(courses);
      } catch (error) {
        res.status(500).json({ message: 'Failed to fetch courses' });
      }
});

// const loginUser = async (req, res) => {
router.get('/:id/Details',async(req, res) => {
    const { id } = req.params;
    try {
      const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch course details' });
    }
});

module.exports = router;
