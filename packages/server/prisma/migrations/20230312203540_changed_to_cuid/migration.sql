/*
  Warnings:

  - The primary key for the `Answer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Application` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ApplicationSubmission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Club` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClubContactInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClubMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ClubProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Score` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ScoringCriteria` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SocialMedia` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TimelineEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[auth0_Id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `auth0_Id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_applicationSubmissionId_fkey";

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationSubmission" DROP CONSTRAINT "ApplicationSubmission_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "ClubContactInfo" DROP CONSTRAINT "ClubContactInfo_clubProfileId_fkey";

-- DropForeignKey
ALTER TABLE "ClubMember" DROP CONSTRAINT "ClubMember_clubId_fkey";

-- DropForeignKey
ALTER TABLE "ClubProfile" DROP CONSTRAINT "ClubProfile_clubId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_applicationSubmissionId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_scoringCriteriaId_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "ScoringCriteria" DROP CONSTRAINT "ScoringCriteria_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "SocialMedia" DROP CONSTRAINT "SocialMedia_clubProfileId_fkey";

-- DropForeignKey
ALTER TABLE "TimelineEvent" DROP CONSTRAINT "TimelineEvent_clubProfileId_fkey";

-- DropForeignKey
ALTER TABLE "_ClubToUser" DROP CONSTRAINT "_ClubToUser_A_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "applicationSubmissionId" SET DATA TYPE TEXT,
ALTER COLUMN "questionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Answer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Answer_id_seq";

-- AlterTable
ALTER TABLE "Application" DROP CONSTRAINT "Application_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clubId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Application_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Application_id_seq";

-- AlterTable
ALTER TABLE "ApplicationSubmission" DROP CONSTRAINT "ApplicationSubmission_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "applicationId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ApplicationSubmission_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ApplicationSubmission_id_seq";

-- AlterTable
ALTER TABLE "Club" DROP CONSTRAINT "Club_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Club_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Club_id_seq";

-- AlterTable
ALTER TABLE "ClubContactInfo" DROP CONSTRAINT "ClubContactInfo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clubProfileId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ClubContactInfo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ClubContactInfo_id_seq";

-- AlterTable
ALTER TABLE "ClubMember" DROP CONSTRAINT "ClubMember_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clubId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ClubMember_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ClubMember_id_seq";

-- AlterTable
ALTER TABLE "ClubProfile" DROP CONSTRAINT "ClubProfile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clubId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ClubProfile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ClubProfile_id_seq";

-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "applicationSubmissionId" SET DATA TYPE TEXT,
ALTER COLUMN "memberId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Comment_id_seq";

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "applicationId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Question_id_seq";

-- AlterTable
ALTER TABLE "Score" DROP CONSTRAINT "Score_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "submissionId" SET DATA TYPE TEXT,
ALTER COLUMN "scoringCriteriaId" SET DATA TYPE TEXT,
ALTER COLUMN "memberId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Score_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Score_id_seq";

-- AlterTable
ALTER TABLE "ScoringCriteria" DROP CONSTRAINT "ScoringCriteria_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "applicationId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ScoringCriteria_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ScoringCriteria_id_seq";

-- AlterTable
ALTER TABLE "SocialMedia" DROP CONSTRAINT "SocialMedia_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clubProfileId" SET DATA TYPE TEXT,
ADD CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "SocialMedia_id_seq";

-- AlterTable
ALTER TABLE "TimelineEvent" DROP CONSTRAINT "TimelineEvent_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clubProfileId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TimelineEvent_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "auth0_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "_ClubToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_auth0_Id_key" ON "User"("auth0_Id");

-- AddForeignKey
ALTER TABLE "ClubMember" ADD CONSTRAINT "ClubMember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubProfile" ADD CONSTRAINT "ClubProfile_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubContactInfo" ADD CONSTRAINT "ClubContactInfo_clubProfileId_fkey" FOREIGN KEY ("clubProfileId") REFERENCES "ClubProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_clubProfileId_fkey" FOREIGN KEY ("clubProfileId") REFERENCES "ClubProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineEvent" ADD CONSTRAINT "TimelineEvent_clubProfileId_fkey" FOREIGN KEY ("clubProfileId") REFERENCES "ClubProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationSubmission" ADD CONSTRAINT "ApplicationSubmission_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoringCriteria" ADD CONSTRAINT "ScoringCriteria_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_applicationSubmissionId_fkey" FOREIGN KEY ("applicationSubmissionId") REFERENCES "ApplicationSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ApplicationSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_scoringCriteriaId_fkey" FOREIGN KEY ("scoringCriteriaId") REFERENCES "ScoringCriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_applicationSubmissionId_fkey" FOREIGN KEY ("applicationSubmissionId") REFERENCES "ApplicationSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ClubMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
