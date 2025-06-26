import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const deleteCategoryWithChildren = async (categoryId) => {
  await prisma.$transaction(async (tx) => {
    // Find all child categories
    const children = await tx.category.findMany({
      where: { parentId: categoryId },
      select: { id: true },
    });

    // Recursively delete children
    for (const child of children) {
      await deleteCategoryWithChildren(child.id); // recursive call uses global prisma
    }

    // Unlink this category from courses
    const courses = await tx.course.findMany({
      where: {
        categories: {
          some: { id: categoryId },
        },
      },
      include: { categories: true },
    });

    for (const course of courses) {
      if (course.categories.length === 1) {
        // This category is the only one
        await tx.course.delete({ where: { id: course.id } });
      } else {
        // Just disconnect this category
        await tx.course.update({
          where: { id: course.id },
          data: {
            categories: {
              disconnect: { id: categoryId },
            },
          },
        });
      }
    }

    // Delete related exams
    await tx.exam.deleteMany({
      where: { categoryId: categoryId },
    });

    // Finally, delete the category
    await tx.category.delete({ where: { id: categoryId } });
  });
};
