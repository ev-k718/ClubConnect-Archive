/*
  Warnings:

  - You are about to drop the column `memberId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `Score` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[applicationSubmissionId,scoringCriteriaId,userId]` on the table `Score` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_memberId_fkey";

-- DropIndex
DROP INDEX "Score_applicationSubmissionId_scoringCriteriaId_memberId_key";

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "memberId";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "memberId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Score_applicationSubmissionId_scoringCriteriaId_userId_key" ON "Score"("applicationSubmissionId", "scoringCriteriaId", "userId");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
