import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      isFree,
      imageUrl,
      level,
      duration,
      categoryId,
    } = req.body;

    const instructorId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: instructorId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Only instructors or admins can create courses" });
    }

    if (
      !title ||
      !description ||
      price === undefined ||
      isFree === undefined ||
      !imageUrl ||
      !level ||
      duration === undefined ||
      categoryId === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
        isFree,
        level,
        duration,
        instructorId: instructorId,
        categoryId: parseInt(categoryId),
      },
    });

    res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while creating course" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    // Destructure and sanitize query parameters
    const {
      search = "",
      level,
      categoryId,
      isFree,
      page = 1,
      limit = 10,
    } = req.query;

    const parsedCategoryId = categoryId ? parseInt(categoryId) : undefined;
    const parsedIsFree = isFree !== undefined ? isFree === "true" : undefined;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build filters object
    const filters = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(level && { level }),
      ...(parsedCategoryId && { categoryId: parsedCategoryId }),
      ...(parsedIsFree !== undefined && { isFree: parsedIsFree }),
    };

    // Fetch filtered courses
    const courses = await prisma.course.findMany({
      where: filters,
      include: {
        instructor: { select: { name: true } },
        category: true,
        CourseReview: true,
        enrollments: true,
        lessons: true,
        quizzes: true,
        exams: true,
        CourseProgress: true,
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });

    // Count total for pagination
    const totalCourses = await prisma.course.count({ where: filters });

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      total: totalCourses,
      page: parseInt(page),
      limit: parseInt(limit),
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error while fetching courses" });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: { select: { name: true, bio: true, avatarUrl: true } },
        CourseReview: {
          include: {
            user: {
              select: { name: true, email: true, avatarUrl: true },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching course details",
      error: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  const courseId = parseInt(req.params.id);
  const instructorId = req.user.id;

  // const { title, description, price, imageUrl } = req.body;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      course.instructorId !== instructorId &&
      req.user.role !== "ADMIN" &&
      req.user.role !== "INSTRUCTOR"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this course",
      });
    }

    const {
      title,
      description,
      price,
      imageUrl,
      level,
      duration,
      categoryId,
      isFree,
    } = req.body;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(imageUrl && { imageUrl }),
      ...(level && { level }),
      ...(duration !== undefined && { duration }),
      ...(categoryId !== undefined && { categoryId: parseInt(categoryId) }),
      ...(isFree !== undefined && { isFree }),
    };

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating course",
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const instructorId = req.user.id;

    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      course.instructorId !== instructorId &&
      req.user.role !== "ADMIN" &&
      req.user.role !== "INSTRUCTOR"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this course",
      });
    }

    await prisma.course.delete({ where: { id: courseId } });
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting course" });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const userId = req.user.id;

    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    if (!courseId) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    if (!userId) {
      return res.status(400).json({ message: "Invalid user" });
    }

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
        .json({ success: false, message: "Already enrolled in this course" });
    }

    // Check if the user is an instructor or admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.role === "INSTRUCTOR" || user.role === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Instructors and admins cannot enroll in courses",
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        user: {
          connect: { id: userId },
        },
        course: {
          connect: { id: courseId },
        },
      },
    });

    // Update student count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        studentsCount: { increment: 1 },
      },
    });

    res.status(200).json({
      success: true,
      message: "Enrolled in course successfully",
      data: enrollment,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({
      success: false,
      message: "Server error while enrolling in course",
    });
  }
};

export const unenrollFromCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    if (!userId) {
      return res.status(400).json({ message: "Invalid user" });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ success: false, message: "Enrollment not found" });
    }

    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    // Update student count
    await prisma.course.update({
      where: { id: courseId },
      data: {
        studentsCount: { decrement: 1 },
      },
    });

    res.status(200).json({
      success: true,
      message: "Unenrolled from course successfully",
    });
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    res.status(500).json({
      success: false,
      message: "Server error while unenrolling from course",
    });
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

export const submitReview = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const userId = req.user.id;
    const { rating, comment } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    if (!userId) {
      return res.status(400).json({ message: "Invalid user" });
    }
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const alreadyReviewed = await prisma.courseReview.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this course" });
    }

    const review = await prisma.courseReview.upsert({
      where: {
        userId_courseId: { userId: req.user.id, courseId },
      },
      update: { rating, comment },
      create: {
        userId: req.user.id,
        courseId,
        rating,
        comment,
      },
    });

    res.status(201).json({
      success: true,
      message: "Review summit successfully",
      data: review,
    });
  } catch (err) {
    console.error("Error submitting review:", err);
    if (err.code === "P2002") {
      return res.status(400).json({ message: "Review already exists" });
    }
    if (err.name === "ZodError") {
      return res.status(400).json({ message: err.errors[0].message });
    }
    res.status(500).json({ error: "Failed to submit review" });
  }
};

export const getCourseReview = async (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId = req.user.id;

  if (!courseId) {
    return res.status(400).json({ message: "Invalid course ID" });
  }
  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const review = await prisma.courseReview.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({
      message: "Course review fetched successfully",
      review,
    });
  } catch (error) {
    console.error("Error fetching course review:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching course review" });
  }
};

export const deleteCourseReview = async (req, res) => {
  const courseId = parseInt(req.params.id);
  const userId = req.user.id;

  if (!courseId) {
    return res.status(400).json({ message: "Invalid course ID" });
  }
  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const review = await prisma.courseReview.delete({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    res.status(200).json({
      message: "Course review deleted successfully",
      review,
    });
  } catch (error) {
    console.error("Error deleting course review:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting course review" });
  }
};

export const getCourseProgress = async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;

  if (!courseId) {
    return res.status(400).json({ message: "Invalid course ID" });
  }
  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    const progress = await prisma.courseProgress.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.status(200).json({
      success: true,
      message: "Course progress fetched successfully",
      data: progress || {},
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching course progress",
    });
  }
};

export const updateCourseProgress = async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user.id;
  const { progressPercent, completedLessons } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "Invalid course ID" });
  }
  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }
  if (progress < 0 || progress > 100) {
    return res
      .status(400)
      .json({ message: "Progress must be between 0 and 100" });
  }

  try {
    const updatedProgress = await prisma.courseProgress.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      update: { progressPercent, completedLessons },
      create: {
        userId,
        courseId,
        progressPercent,
        completedLessons,
      },
    });

    res.status(200).json({
      message: "Course progress updated successfully",
      updatedProgress,
    });
  } catch (error) {
    console.error("Error updating course progress:", error);
    res
      .status(500)
      .json({ message: "Server error while updating course progress" });
  }
};
