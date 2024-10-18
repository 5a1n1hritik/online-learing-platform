const express = require("express");
const { PrismaClient } = require("@prisma/client");
const verifyAdmin = require("../middlewares/verifyAdmin");
const router = express.Router();
const prisma = new PrismaClient();

// Courses management
router.get("/courses", verifyAdmin, async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching courses" });
  }
});

router.post("/add/courses", verifyAdmin, async (req, res) => {
  const { title, description, syllabus } = req.body;

  if (!title || !description || !syllabus) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const course = await prisma.course.create({
      data: { title, description, syllabus },
    });
    res.status(201).json(course);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the course" });
  }
});

router.put("/courses/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, syllabus } = req.body;
  
  try {
    const courseExists = await prisma.course.findUnique({ where: { id: Number(id) } });
    if (!courseExists) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: Number(id) },
      data: { title, description, syllabus },
    });
    res.json(updatedCourse);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the course" });
  }
});

router.delete("/courses/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const courseExists = await prisma.course.findUnique({ where: { id: Number(id) } });
    if (!courseExists) {
      return res.status(404).json({ error: "Course not found" });
    }

    await prisma.course.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the course" });
  }
});

// Users management
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});

router.put("/users/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ error: "Name and role are required" });
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, role },
    });

    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
});

router.delete("/users/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const userExists = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
});

module.exports = router;
