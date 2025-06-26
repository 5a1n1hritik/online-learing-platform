import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role, isVerified } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Dynamic filters
    const filters = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
        role ? { role: role.toUpperCase() } : undefined,
        isVerified !== undefined
          ? { isVerified: isVerified === "true" }
          : undefined,
      ].filter(Boolean),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: filters,
        skip,
        take: limitNumber,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          courses: {
            select: {
              course: {
                select: { id: true, title: true },
              },
            },
          },
          //   quizSubmissions: {
          //     select: { id: true },
          //   },
          //   examSubmissions: {
          //     select: { id: true },
          //   },
        },
      }),
      prisma.user.count({ where: filters }),
    ]);

    // Format course titles and counts
    const formattedUsers = users.map((user) => ({
      ...user,
      courses: user.courses.map((c) => c.course),
      //   totalQuizzes: user.quizSubmissions.length,
      //   totalExams: user.examSubmissions.length,
    }));

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: formattedUsers,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        bio: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        courses: {
          select: {
            course: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
                isPaid: true,
              },
            },
          },
        },
        instructedCourses: {
          select: {
            id: true,
            title: true,
            studentsCount: true,
            rating: true,
          },
        },
        quizSubmissions: {
          select: {
            id: true,
            quizId: true,
            score: true,
            timeTaken: true,
            submittedAt: true,
          },
        },
        examSubmissions: {
          select: {
            id: true,
            examId: true,
            score: true,
            status: true,
            submittedAt: true,
          },
        },
        activityStats: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Format course titles
    user.courses = user.courses.map((c) => c.course);

    res.json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user details" });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, role } = req.body;

  if (!name && !role) {
    return res
      .status(400)
      .json({ error: "At least one of name or role must be provided" });
  }

  const allowedRoles = ["ADMIN", "STUDENT", "INSTRUCTOR"];
  if (role && !allowedRoles.includes(role.toUpperCase())) {
    return res.status(400).json({ error: "Invalid role provided" });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role.toUpperCase();

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: { id: Number(userId) },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
};

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
  if (
    !title ||
    !description ||
    !imageUrl ||
    isPaid === undefined ||
    !level ||
    !duration ||
    !status
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
  try {
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        imageUrl,
        isPaid,
        price: isPaid ? price : 0,
        level,
        duration,
        status,
        instructor: {
          connect: { id: Number(userId) }, // Connect to the instructor using userId
        },
        categories: {
          connect: categoryIds.map((id) => ({ id: Number(id) })), // Connect categories
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
    res.status(500).json({ message: "Internal Server Error" });
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

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, description: true, imageUrl: true },
    });

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCategory = async (req, res) => {
  const { name, description, imageUrl } = req.body;

  if (!name || !description || !imageUrl) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newCategory = await prisma.category.create({
      data: { name, description, imageUrl },
      select: { id: true, name: true, description: true, imageUrl: true },
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, description, imageUrl } = req.body;

  try {
    const categoryExists = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(categoryId) },
      data: { name, description, imageUrl },
      select: { id: true, name: true, description: true, imageUrl: true },
    });

    res.json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const categoryExists = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found" });
    }

    await prisma.category.delete({
      where: { id: Number(categoryId) },
    });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
