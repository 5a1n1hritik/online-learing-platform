import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCategory = async (req, res) => {
  const { name } = req.body;
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

  if (!name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating category",
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

export const getCoursesByCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const courses = await prisma.course.findMany({
      where: { categoryId: parseInt(id) },
    });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses by category" });
  }
};
