-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PASSED', 'FAILED', 'PENDING');

-- AlterTable
ALTER TABLE "ExamSubmission" ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING';
