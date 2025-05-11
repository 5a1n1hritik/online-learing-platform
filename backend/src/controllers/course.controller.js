import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCourse = async (req, res) => {
  const { title, description, price, imageUrl } = req.body;
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Only instructors or admins can create courses" });
    }

    if (!title || !description || !price || !imageUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
        instructorId: userId,
      },
    });

    res.status(200).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server error while creating course" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { instructor: { select: { name: true } } },
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    res.status(200).json({
      message: "All courses fetched successfully",
      courses,
    });

  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error while fetching courses" });
  }
};

export const getCourseDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: { instructor: { select: { name: true } } },
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({
      message: "Course details fetched successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course details", error });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, imageUrl } = req.body;
  const userId = req.user.id;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      course.instructorId !== userId &&
      req.user.role !== "ADMIN" &&
      req.user.role !== "INSTRUCTOR"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this course" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
      },
    });

    res.status(200).json({
      message: "Course updated successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server error while updating course" });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      course.instructorId !== userId &&
      req.user.role !== "ADMIN" &&
      req.user.role !== "INSTRUCTOR"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this course" });
    }

    await prisma.course.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error while deleting course" });
  }
};

export const enrollInCourse = async (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId = req.user.id;

  if (!courseId) {
    return res.status(400).json({ message: "Invalid course ID" });
  }
  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const alreadyEnrolled = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (alreadyEnrolled) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Check if the user is an instructor or admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
      return res
        .status(403)
        .json({ message: "Instructors and admins cannot enroll in courses" });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    res
      .status(200)
      .json({ message: "Enrolled in course successfully", enrollment });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ message: "Server error while enrolling in course" });
  }
};

export const getEnrolledCourses = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: { instructor: { select: { name: true } } },
        },
      },
    });

    res.status(200).json({
      message: "Enrolled courses fetched successfully",
      enrollments,
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching enrolled courses" });
  }
};

export const getEnrolledCoursesById = async (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId = req.user.id;

  if (!courseId) {
    return res.status(400).json({ message: "Invalid course ID" });
  }
  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: { instructor: { select: { name: true } } },
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: { select: { name: true } } },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructorId === userId) {
      return res
        .status(403)
        .json({ message: "Instructors cannot enroll in their own courses" });
    }

    res.status(200).json({
      message: "Enrolled course fetched successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Error fetching enrolled course by ID:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching enrolled course" });
  }
};

export const getInstructorCourses = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Only instructors or admins can view courses" });
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: userId },
      include: { instructor: { select: { name: true } } },
    });

    res.status(200).json({
      message: "Instructor courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching instructor courses" });
  }
};

export const getInstructorCoursesById = async (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId = req.user.id;

  if (!courseId) {
    return res.status(400).json({ message: "Invalid course ID" });
  }
  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructor: { select: { name: true } } },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructorId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to view this course" });
    }

    res.status(200).json({
      message: "Instructor course fetched successfully",
      course,
    });
  } catch (error) {
    console.error("Error fetching instructor course by ID:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching instructor course" });
  }
};
