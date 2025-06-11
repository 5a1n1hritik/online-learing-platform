-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "description" TEXT,
ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "negativeMarking" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "participants" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tags" TEXT[];
