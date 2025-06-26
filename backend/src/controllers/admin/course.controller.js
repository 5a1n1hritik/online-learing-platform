import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCourse = async (req, res) => {
  const {
    title,
    description,
    imageUrl,
    isPaid,
    price,
    level,
    duration,
    status,
    categoryIds = [],
  } = req.body;

  const { userId } = req.user;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    !title ||
    !description ||
    !imageUrl ||
    isPaid === undefined ||
    !level ||
    !duration
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (isPaid && price === undefined) {
    return res
      .status(400)
      .json({ error: "Price is required for paid courses" });
  }
  if (
    !Array.isArray(categoryIds) ||
    categoryIds.some((id) => typeof id !== "number")
  ) {
    return res.status(400).json({ error: "Invalid category IDs" });
  }

  const allowedStatuses = ["DRAFT", "PUBLISHED"];

  try {
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        imageUrl,
        isPaid,
        price: isPaid ? parseFloat(price) : 0,
        level,
        duration,
        status: allowedStatuses.includes(status) ? status : "DRAFT",
        instructor: {
          connect: { id: Number(userId) },
        },
        categories: {
          connect: categoryIds.map((id) => ({ id: Number(id) })),
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        isPaid: true,
        price: true,
        level: true,
        duration: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        instructor: {
          select: { id: true, name: true, avatarUrl: true },
        },
        categories: true,
      },
    });
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      level,
      isPaid,
      categoryId,
      status,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const filters = {
      AND: [
        level ? { level } : {},
        status ? { status } : {},
        isPaid !== undefined ? { isPaid: isPaid === "true" } : {},
        categoryId
          ? {
              categories: {
                some: {
                  id: parseInt(categoryId),
                },
              },
            }
          : {},
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                {
                  instructor: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              ],
            }
          : {},
      ],
    };

    const [total, courses] = await Promise.all([
      prisma.course.count({ where: filters }),
      prisma.course.findMany({
        where: filters,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNumber,
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          isPaid: true,
          price: true,
          level: true,
          duration: true,
          status: true,
          categories: true,
          rating: true,
          studentsCount: true,
          createdAt: true,
          updatedAt: true,
          instructor: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      }),
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
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCourseDetails = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        categories: true,
        lessons: {
          select: {
            id: true,
            title: true,
            description: true,
            videoUrl: true,
            materialUrl: true,
            duration: true,
            type: true,
          },
        },
        quizzes: {
          select: {
            id: true,
            title: true,
            timeLimit: true,
            passingScore: true,
            dueDate: true,
            maxAttempts: true,
            createdAt: true,
          },
        },
        exams: {
          select: {
            id: true,
            title: true,
            description: true,
            timeLimit: true,
            passingScore: true,
            type: true,
            difficulty: true,
            tags: true,
            negativeMarking: true,
            createdAt: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({
      success: true,
      message: "Course details fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching course details" });
  }
};

export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const {
    title,
    description,
    imageUrl,
    isPaid,
    price,
    level,
    duration,
    status,
  } = req.body;

  try {
    const courseExists = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!courseExists) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Dynamically build the data object only with provided fields
    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
    if (isPaid !== undefined) dataToUpdate.isPaid = isPaid;
    if (price !== undefined) dataToUpdate.price = price;
    if (level !== undefined) dataToUpdate.level = level;
    if (duration !== undefined) dataToUpdate.duration = duration;
    if (status !== undefined) dataToUpdate.status = status;

    const updatedCourse = await prisma.course.update({
      where: { id: Number(courseId) },
      data: dataToUpdate,
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        isPaid: true,
        price: true,
        level: true,
        duration: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the course" });
  }
};

export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const courseExists = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!courseExists) {
      return res.status(404).json({ error: "Course not found" });
    }

    await prisma.course.delete({
      where: { id: Number(courseId) },
    });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the course" });
  }
};

export const toggleCourseStatus = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
      select: {
        id: true,
        title: true,
        status: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const newStatus = course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    const updatedCourse = await prisma.course.update({
      where: { id: Number(courseId) },
      data: { status: newStatus },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      message: `Course status updated to "${updatedCourse.status}" successfully`,
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error toggling course status:", error);
    res
      .status(500)
      .json({ error: "An error occurred while toggling course status" });
  }
};
