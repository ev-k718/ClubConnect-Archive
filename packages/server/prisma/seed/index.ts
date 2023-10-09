import prisma from '../client';
import {
  deleteApplications,
  deleteQuestions,
  deleteScoringCriteria,
  generateFullApplication,
} from './applicationSeed';
import {
  deleteClubMembers,
  deleteClubs,
  generateClub,
  generateMembers,
} from './clubSeed';
import {
  deleteAnswers,
  deleteApplicationSubmissions,
  deleteComments,
  deleteScores,
  generateDraftSubmissions,
  scoreApplicants,
} from './submissionSeed';
import { deleteUsers, generateUsers } from './userSeed';

const cleanUpDB = async () => {
  await prisma.$transaction([
    //Any tables that need to be cleaned up should be added here ie.
    deleteComments,
    deleteScores,
    deleteAnswers,
    deleteApplicationSubmissions,
    deleteQuestions,
    deleteScoringCriteria,
    deleteApplications,
    deleteClubMembers,
    deleteClubs,
    deleteUsers,
  ]);
};

/**
 * Change values in here to update the seeded data
 */
const seed = async () => {
  const NUM_CLUBS = 10;
  const NUM_USERS = 50;

  await cleanUpDB();
  await generateUsers(NUM_USERS);

  //creates new clubs
  for (let i = 0; i < NUM_CLUBS; i++) {
    const new_club = await generateClub(false);
    await generateMembers(new_club.id);

    //creates an application for club (filled w questions & scoring criteria)
    const application = await generateFullApplication(new_club.id);
    await generateDraftSubmissions(application.id);
    //club members score all the application submissions
    await scoreApplicants(application.id);
  }
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
