import { PrismaClient } from "@prisma/client";
import { deleteCategoryWithChildren } from "../../utils/categoryUtils.js";
const prisma = new PrismaClient();

export const createCategory = async (req, res) => {
  const { name, description = "", parentId } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    if (parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: Number(parentId) },
      });

      if (!parentCategory) {
        return res.status(400).json({ error: "Invalid parent category ID" });
      }
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        parentId: parentId ? Number(parentId) : null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        parentId: true,
      },
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

export const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", parentId } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Filters
    const filters = {
      AND: [
        search ? { name: { contains: search, mode: "insensitive" } } : {},
        parentId ? { parentId: Number(parentId) } : {},
      ],
    };

    // Fetch data with pagination
    const [total, categories] = await Promise.all([
      prisma.category.count({ where: filters }),
      prisma.category.findMany({
        where: filters,
        orderBy: { name: "asc" },
        skip,
        take: limitNumber,
        select: {
          id: true,
          name: true,
          description: true,
          parentId: true,
          parent: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
      select: {
        id: true,
        name: true,
        description: true,
        parentId: true,
        parent: {
          select: { id: true, name: true },
        },
        children: {
          select: { id: true, name: true },
        },
        courses: {
          select: { id: true, title: true },
        },
        exams: {
          select: { id: true, title: true },
        },
      },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name, description, parentId } = req.body;

  try {
    const categoryExists = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (parentId && Number(parentId) === Number(categoryId)) {
      return res
        .status(400)
        .json({ error: "A category cannot be its own parent" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (parentId !== undefined)
      updateData.parentId = parentId ? Number(parentId) : null;

    const updatedCategory = await prisma.category.update({
      where: { id: Number(categoryId) },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        parentId: true,
      },
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
  const force = req.query.force === "true";
  const id = Number(categoryId);

  try {
    const categoryExists = await prisma.category.findUnique({ where: { id } });
    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (force) {
      // 🔒 Allow only ADMIN to force delete
      if (!req.user || req.user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ error: "Only admins can force delete categories" });
      }

      await deleteCategoryWithChildren(id);

      // 📓 Optional: Log the action
      await prisma.auditLog.create({
        data: {
          action: "FORCE_DELETE_CATEGORY",
          userId: req.user.userId,
          details: `Deleted category ${id} and its subcategories recursively`,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Category and related data deleted (force delete)",
      });
    }

    // Normal checks
    const childCount = await prisma.category.count({ where: { parentId: id } });
    if (childCount > 0) {
      return res.status(400).json({
        error: "Cannot delete category with subcategories. Use ?force=true",
      });
    }

    const courseCount = await prisma.course.count({
      where: {
        categories: {
          some: { id },
        },
      },
    });

    const examCount = await prisma.exam.count({ where: { categoryId: id } });

    if (courseCount > 0 || examCount > 0) {
      return res.status(400).json({
        error:
          "Cannot delete category associated with courses or exams. Use ?force=true",
      });
    }

    await prisma.category.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_CATEGORY",
        userId: req.user.userId,
        details: `Deleted category ${id} (no dependencies)`,
      },
    });
    
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
