-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('QUIZ', 'PRACTICE', 'MOCK', 'FINAL');

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "paperId" INTEGER,
ADD COLUMN     "type" "ExamType" NOT NULL DEFAULT 'QUIZ';

-- CreateTable
CREATE TABLE "ExamPaper" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamPaperQuestion" (
    "id" SERIAL NOT NULL,
    "paperId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExamPaperQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamActivity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExamActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "ExamPaper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPaperQuestion" ADD CONSTRAINT "ExamPaperQuestion_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "ExamPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPaperQuestion" ADD CONSTRAINT "ExamPaperQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ExamQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamActivity" ADD CONSTRAINT "ExamActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamActivity" ADD CONSTRAINT "ExamActivity_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
