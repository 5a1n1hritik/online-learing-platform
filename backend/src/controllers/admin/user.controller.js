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
