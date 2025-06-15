import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      isPaid,
      imageUrl,
      level,
      duration,
      categoryId = [],
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
      isPaid === undefined ||
      !imageUrl ||
      !level ||
      duration === undefined ||
      !Array.isArray(categoryId) ||
      categoryId.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
        isPaid,
        level,
        duration,
        instructorId: instructorId,
        categories: {
          connect: categoryId.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        categories: { select: { id: true, name: true } },
        instructor: { select: { id: true, name: true } },
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
    const {
      search,
      level,
      categoryId,
      isPaid,
      page = 1,
      limit = 9,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const filters = {};
    if (level) filters.level = level;
    if (isPaid !== undefined) filters.isPaid = isPaid === "true";
    if (categoryId) {
      filters.categories = {
        some: {
          id: parseInt(categoryId),
        },
      };
    }

    const searchConditions = [];
    if (search) {
      searchConditions.push(
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      );
    }

    const where = {
      ...filters,
      ...(searchConditions.length > 0 && {
        OR: searchConditions,
      }),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        include: {
          categories: { select: { id: true, name: true } },
          instructor: { select: { id: true, name: true } },
          enrollments: true,
          CourseProgress: true,
          CourseReview: true,
          lessons: true,
          quizzes: true,
          exams: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.course.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const { sort = "recent", rating, page = 1, limit = 5 } = req.query;

    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.min(50, parseInt(limit));
    const skip = (parsedPage - 1) * parsedLimit;

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            bio: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        categories: true,
        enrollments: true,
        contents: true,
        lessons: true,
        quizzes: {
          include: {
            questions: true,
          },
        },
        exams: {
          include: {
            paper: {
              include: {
                questions: {
                  orderBy: { order: "asc" },
                  include: {
                    question: true,
                  },
                },
              },
            },
          },
        },
        CourseProgress: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Construct review filters and sorting
    const reviewWhere = {
      courseId,
      ...(rating && { rating: parseInt(rating) }),
    };

    let reviewOrderBy = [{ pinned: "desc" }, { createdAt: "desc" }];
    if (sort === "highest")
      reviewOrderBy = [{ pinned: "desc" }, { rating: "desc" }];
    else if (sort === "lowest")
      reviewOrderBy = [{ pinned: "desc" }, { rating: "asc" }];

    // Total reviews (for stats and pagination)
    const totalReviews = await prisma.courseReview.count({
      where: reviewWhere,
    });

    // Paginated & sorted reviews
    const reviews = await prisma.courseReview.findMany({
      where: reviewWhere,
      orderBy: reviewOrderBy,
      skip,
      take: parsedLimit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
    });

    // Average rating
    const allReviews = await prisma.courseReview.findMany({
      where: { courseId },
      select: { rating: true },
    });

    const averageRating =
      allReviews.length > 0
        ? Number(
            (
              allReviews.reduce((sum, r) => sum + r.rating, 0) /
              allReviews.length
            ).toFixed(1)
          )
        : 0;

    // Breakdown
    const breakdown = [5, 4, 3, 2, 1].map((star) => {
      const count = allReviews.filter((r) => r.rating === star).length;
      return {
        rating: star,
        count,
        percentage:
          allReviews.length > 0
            ? Math.round((count / allReviews.length) * 100)
            : 0,
      };
    });

    const formattedReviews = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment || "",
      helpful: r.helpful,
      unhelpful: r.unhelpful,
      verified: r.verified,
      featured: r.pinned,
      date: r.createdAt,
      user: {
        id: r.user?.id || null,
        name: r.user?.name || "Anonymous",
        email: r.user?.email || "",
        avatar: r.user?.avatarUrl || null,
        isVerified: r.user?.isVerified || false,
      },
    }));

    // Send response
    res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: {
        ...course,
        reviews: formattedReviews,
        reviewStats: {
          totalReviews: allReviews.length,
          averageRating,
          breakdown,
          currentPage: parsedPage,
          totalPages: Math.max(1, Math.ceil(totalReviews / parsedLimit)),
        },
      },
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

    if (!courseId || !userId) {
      return res.status(400).json({ message: "Invalid course or user" });
    }
    if (!rating || !comment || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be 1–5 and comment is required" });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ Check if user is enrolled and has completed some part (lessons, % etc.)
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      // include: { progress: true },
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You must be enrolled to submit a review" });
    }

    // if (enrollment.progress?.percentageCompleted < 20) {
    //   return res
    //     .status(403)
    //     .json({ message: "Complete at least 20% of the course to review" });
    // }

    const verified = enrollment?.progress?.percentageCompleted >= 20;

    const review = await prisma.courseReview.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      update: { rating, comment },
      create: { userId, courseId, rating, comment },
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (err) {
    console.error("Error submitting review:", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
};

export const getCourseReview = async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const { sort = "recent", rating } = req.query;

  if (!courseId) {
    return res.status(400).json({ message: "Invalid course" });
  }

  try {
    const where = {
      courseId,
      ...(rating && { rating: parseInt(rating) }),
    };

    let orderBy = [{ pinned: "desc" }, { createdAt: "desc" }];
    if (sort === "highest") orderBy = [{ pinned: "desc" }, { rating: "desc" }];
    else if (sort === "lowest")
      orderBy = [{ pinned: "desc" }, { rating: "asc" }];

    const reviews = await prisma.courseReview.findMany({
      where,
      orderBy,
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
    });

    if (!reviews) {
      return res.status(404).json({ message: "Review not found" });
    }

    const pinnedReviews = await prisma.courseReview.findMany({
      where: { courseId, pinned: true },
      take: 2,
      orderBy: { createdAt: "desc" },
    });

    // Optional: Overall Rating and Breakdown
    const stats = await prisma.courseReview.groupBy({
      by: ["rating"],
      where: { courseId },
      _count: true,
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const breakdown = [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((r) => r.rating === star).length;
      return {
        rating: star,
        count,
        percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
      };
    });

    const formattedReviews = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title || "",
      comment: r.comment,
      date: r.createdAt,
      helpful: r.helpful || 0,
      unhelpful: r.unhelpful || 0,
      featured: r.pinned || false,
      user: {
        name: r.user?.name || "Anonymous",
        avatar: r.user?.avatarUrl || null,
        isVerified: r.user?.isVerified || false,
      },
    }));

    return res.status(200).json({
      message: "Reviews fetched",
      data: formattedReviews,
      stats: {
        totalReviews,
        averageRating: Number(averageRating.toFixed(1)),
        breakdown,
        pinnedReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const voteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { type } = req.body;

    const review = await prisma.courseReview.findUnique({
      where: { id: parseInt(reviewId) },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const updateField =
      type === "helpful"
        ? { helpful: { increment: 1 } }
        : { unhelpful: { increment: 1 } };

    await prisma.courseReview.update({
      where: { id: parseInt(reviewId) },
      data: updateField,
    });

    return res.status(200).json({ message: "Vote recorded" });
  } catch (error) {
    console.error("[VOTE_REVIEW]", error);
    return res.status(500).json({ message: "Internal server error" });
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
