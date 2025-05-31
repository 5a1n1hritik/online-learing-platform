-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('STARTED', 'IN_PROGRESS', 'COMPLETED', 'TIMEOUT');

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "categoryId" INTEGER,
ALTER COLUMN "courseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ExamActivity" ADD COLUMN     "durationSeconds" INTEGER,
ADD COLUMN     "status" "ExamStatus" NOT NULL DEFAULT 'STARTED';

-- AlterTable
ALTER TABLE "ExamAnswer" ADD COLUMN     "attempted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "examActivityId" INTEGER,
ALTER COLUMN "selectedOption" DROP NOT NULL,
ALTER COLUMN "isCorrect" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_examActivityId_fkey" FOREIGN KEY ("examActivityId") REFERENCES "ExamActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
