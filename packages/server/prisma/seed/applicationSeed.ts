//seeds an application and related tables like questions & scoring
import { faker } from '@faker-js/faker';

import prisma from '../client';
import { getRandomInt } from '../helper';

/**
 * Generates an application for a club, fills it with questions and
 * scoring criteria
 */
export const generateFullApplication = async (clubId: string) => {
  const application = await generateApplication(clubId);
  await generateQuestions(application.id);
  await generateScoringCriterias(application.id);
  return application;
};

/**
 * Generates an application for a club
 */
export const generateApplication = (clubId: string) => {
  const name = faker.lorem.words(3);
  const description = faker.lorem.words(6);
  const openDate = faker.date.between(new Date(), '2024-04-01T00:00:00.000Z');
  const deadline = faker.date.between(openDate, '2024-05-01T00:00:00.000Z');

  return prisma.application.create({
    data: {
      clubId,
      name,
      description,
      deadline,
      openDate,
    },
  });
};

/**
 * Generates a random amount of questions into an application
 */
export const generateQuestions = async (applicationId: string) => {
  const numQuestions = getRandomInt(1, 10);
  for (let i = 0; i < numQuestions; i++) {
    await generateQuestion(applicationId);
  }
};

/**
 * Generates a question for an application
 */
const generateQuestion = (applicationId: string) => {
  const value = 'Q: ' + faker.lorem.words(5) + '?';
  const isRequired = faker.datatype.boolean();
  const type =
    faker.datatype.number({ min: 0, max: 9 }) < 9 ? 'TEXT_IN' : 'FILE_UPLOAD';
  return prisma.question.create({
    data: {
      applicationId,
      value,
      isRequired,
      type,
      index: 1
    },
  });
};

/**
 * Generates a random amount of scoring criteria into an application
 */
export const generateScoringCriterias = async (applicationId: string) => {
  const numSc = getRandomInt(1, 5);
  for (let i = 0; i < numSc; i++) {
    await generateScoringCriteria(applicationId);
  }
};

/**
 * Generates a scoring criteria for an application
 */
const generateScoringCriteria = (applicationId: string) => {
  const description = faker.lorem.words(5);
  return prisma.scoringCriteria.create({
    data: {
      applicationId,
      description,
    },
  });
};

export const deleteQuestions = prisma.question.deleteMany();
export const deleteScoringCriteria = prisma.scoringCriteria.deleteMany();
export const deleteApplications = prisma.application.deleteMany();
