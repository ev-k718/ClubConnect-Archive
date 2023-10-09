/*
  Warnings:

  - You are about to drop the column `timelineDescription` on the `ClubProfile` table. All the data in the column will be lost.
  - You are about to drop the column `submissionId` on the `Score` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[applicationSubmissionId,questionId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[applicantId,applicationId]` on the table `ApplicationSubmission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clubProfileId]` on the table `ClubContactInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[applicationSubmissionId,scoringCriteriaId,memberId]` on the table `Score` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clubProfileId,type]` on the table `SocialMedia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `ClubContactInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicationCycleDescription` to the `ClubProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clubSizeDescription` to the `ClubProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicationSubmissionId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_submissionId_fkey";

-- AlterTable
ALTER TABLE "ApplicationSubmission" ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ClubContactInfo" ADD COLUMN     "role" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClubProfile" DROP COLUMN "timelineDescription",
ADD COLUMN     "applicationCycleDescription" TEXT NOT NULL,
ADD COLUMN     "clubSizeDescription" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "submissionId",
ADD COLUMN     "applicationSubmissionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Answer_applicationSubmissionId_questionId_key" ON "Answer"("applicationSubmissionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationSubmission_applicantId_applicationId_key" ON "ApplicationSubmission"("applicantId", "applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ClubContactInfo_clubProfileId_key" ON "ClubContactInfo"("clubProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Score_applicationSubmissionId_scoringCriteriaId_memberId_key" ON "Score"("applicationSubmissionId", "scoringCriteriaId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMedia_clubProfileId_type_key" ON "SocialMedia"("clubProfileId", "type");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_applicationSubmissionId_fkey" FOREIGN KEY ("applicationSubmissionId") REFERENCES "ApplicationSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
