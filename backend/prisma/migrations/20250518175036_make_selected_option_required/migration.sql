/*
  Warnings:

  - Made the column `selectedOptionId` on table `QuizAnswer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "QuizAnswer" DROP CONSTRAINT "QuizAnswer_selectedOptionId_fkey";

-- AlterTable
ALTER TABLE "QuizAnswer" ALTER COLUMN "selectedOptionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "QuizAnswer" ADD CONSTRAINT "QuizAnswer_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "QuizOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
