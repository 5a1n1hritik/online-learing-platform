/*
  Warnings:

  - You are about to drop the column `text` on the `ExamOption` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `ExamQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `QuizOption` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `QuizQuestion` table. All the data in the column will be lost.
  - Added the required column `text_en` to the `ExamOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text_hi` to the `ExamOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_en` to the `ExamQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_hi` to the `ExamQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text_en` to the `QuizOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text_hi` to the `QuizOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_en` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_hi` to the `QuizQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExamOption" DROP COLUMN "text",
ADD COLUMN     "text_en" TEXT NOT NULL,
ADD COLUMN     "text_hi" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExamQuestion" DROP COLUMN "question",
ADD COLUMN     "question_en" TEXT NOT NULL,
ADD COLUMN     "question_hi" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuizOption" DROP COLUMN "text",
ADD COLUMN     "text_en" TEXT NOT NULL,
ADD COLUMN     "text_hi" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "question",
ADD COLUMN     "question_en" TEXT NOT NULL,
ADD COLUMN     "question_hi" TEXT NOT NULL;
