/*
  Warnings:

  - You are about to drop the column `isFree` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "isFree",
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;
