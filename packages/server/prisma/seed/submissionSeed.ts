//seeds an application submission and related tables like their answers &
import { faker } from '@faker-js/faker';
import type { ApplicationSubmission, ClubMember, User } from '@prisma/client';

import prisma from '../client';
import { getRandomInt, getSome } from '../helper';

/**
 * Generates an ApplicationSubmission by an applicant for an application
 */
const generateDraftSubmission = (
  applicationId: string,
  applicantId: string,
) => {
  return prisma.applicationSubmission.create({
    data: {
      applicantId,
      applicationId,
    },
  });
};

export const generateDraftSubmissions = async (applicationId: string) => {
  //get the Club that the application belongs to
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  //finds users who are not members of this club
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        clubMemberships: {
          some: {
            clubId: application?.clubId,
          },
        },
      },
    },
  });

  const applicants = getSome(users, 3);

  //creates a submission filled with answers for each applicant
  let submissions: ApplicationSubmission[] = [];
  for (const applicant of applicants) {
    const submission = await generateDraftSubmission(
      applicationId,
      applicant.id,
    );
    await generateAnswers(submission.id, applicationId, submission.applicantId);
    submissions.push(submission);
  }
  return submissions;
};

export const generateSubmittedSubmission = (id: string) => {
  return prisma.applicationSubmission.update({
    where: {
      id,
    },
    data: {
      status: 'SUBMITTED',
      submittedAt: new Date(),
    },
  });
};

/**
 * Generates answers for an Application Submission
 */
const generateAnswers = async (
  appSubId: string,
  applicationId: string,
  userId: string,
) => {
  //get all questions in the application
  const questions = await prisma.question.findMany({
    where: {
      applicationId,
    },
  });

  //creates an answer in their application submission for every question
  for (const q of questions) {
    await prisma.answer.create({
      data: {
        userId,
        applicationSubmissionId: appSubId,
        questionId: q.id,
        value: faker.lorem.words(10),
      },
    });
  }
};

/**
 * Generates a Score, for a Scoring Criteria, by a Club member
 * for a specific submission application
 */
const generateScore = (
  userId: string,
  applicationSubmissionId: string,
  scoringCriteriaId: string,
) => {
  return prisma.score.create({
    data: {
      userId,
      applicationSubmissionId,
      scoringCriteriaId,
      score: getRandomInt(1, 10),
    },
  });
};

/**
 * Generates a comment for an application submission by a member
 */
const generateComment = (userId: string, applicationSubmissionId: string) => {
  return prisma.comment.create({
    data: {
      userId,
      applicationSubmissionId,
      value: faker.lorem.words(5),
    },
  });
};

/**
 * Simulates club members grading application submissions
 */
export const scoreApplicants = async (applicationId: string) => {
  //gets the submissions for this application
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      submissions: true,
      scoringCriteria: true,
    },
  });

  const club = await prisma.club.findUnique({
    where: {
      id: application?.clubId,
    },
    include: {
      members: true,
    },
  });

  const members = club?.members;
  const submissions = application?.submissions;
  const scoringCriterias = application?.scoringCriteria;

  if (submissions && members && scoringCriterias) {
    //for each submission, random members will score them
    for (const sub of submissions) {
      const graders: ClubMember[] = getSome(
        members,
        getRandomInt(1, members?.length),
      );
      for (const grader of graders) {
        //score for each scoring criteria
        for (const score of scoringCriterias) {
          await generateScore(grader.userId, sub.id, score.id);
        }
        //1 comment per grader per submission
        await generateComment(grader.userId, sub.id);
      }
    }
  }
};

export const deleteAnswers = prisma.answer.deleteMany();
export const deleteApplicationSubmissions =
  prisma.applicationSubmission.deleteMany();
export const deleteScores = prisma.score.deleteMany();
export const deleteComments = prisma.comment.deleteMany();
