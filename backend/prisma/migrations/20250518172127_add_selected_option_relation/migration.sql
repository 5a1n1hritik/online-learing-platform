/*
  Warnings:

  - You are about to drop the column `selectedOption` on the `QuizAnswer` table. All the data in the column will be lost.
  - Added the required column `selectedOptionId` to the `QuizAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizAnswer" DROP COLUMN IF EXISTS "selectedOption";
ALTER TABLE "QuizAnswer" ADD COLUMN "selectedOptionId" INTEGER;

-- AddForeignKey
ALTER TABLE "QuizAnswer"
ADD CONSTRAINT "QuizAnswer_selectedOptionId_fkey"
FOREIGN KEY ("selectedOptionId") REFERENCES "QuizOption"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
