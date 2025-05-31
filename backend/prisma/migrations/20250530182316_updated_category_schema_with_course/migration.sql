/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Course` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT,
ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "_CourseCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseCategories_AB_unique" ON "_CourseCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseCategories_B_index" ON "_CourseCategories"("B");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseCategories" ADD CONSTRAINT "_CourseCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseCategories" ADD CONSTRAINT "_CourseCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
