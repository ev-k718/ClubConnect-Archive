import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import supertest from 'supertest';

import prisma from '../prisma/client';
import {
  deleteApplications,
  deleteQuestions,
  deleteScoringCriteria,
  generateFullApplication,
} from '../prisma/seed/applicationSeed';
import { deleteClubs, generateClub } from '../prisma/seed/clubSeed';
import app from '../src/app';
import getTestAccessToken from './utils/getTestAccessToken';

const request = supertest(app);
const endpoint = '/api/application';

describe(`Test ${endpoint}`, () => {
  const NUM_APPLICATIONS_CREATED = 10;
  beforeEach(async () => {
    for (let i = 0; i < NUM_APPLICATIONS_CREATED; i++) {
      const newClub = await generateClub(true);
      await generateFullApplication(newClub.id);
    }
  });

  afterEach(async () => {
    await prisma.$transaction([
      deleteQuestions,
      deleteScoringCriteria,
      deleteApplications,
      deleteClubs,
    ]);
  });

  describe(`GET ${endpoint}/:id`, () => {
    it('should get an application by id', async () => {
      const accessToken = await getTestAccessToken();
      const applicationId = (await prisma.application.findFirst())?.id;

      const response = await request
        .get(`${endpoint}/${applicationId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(applicationId);
    });

    it('should return 404 if application does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const response = await request
        .get(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe(`GET ${endpoint}/getApplicationsForClub/:clubId`, () => {
    it('should get all applications for a club', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (await prisma.club.findFirst())?.id;

      const response = await request
        .get(`${endpoint}/getApplicationsForClub/${clubId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 200 if club does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const response = await request
        .get(`${endpoint}/getApplicationsForClub/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe(`POST ${endpoint}`, () => {
    it('should create an application', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (await prisma.club.findFirst())?.id;
      const name = 'Test Application';
      const description = 'Test Description';
      const openDate = new Date();
      const deadline = new Date();

      const response = await request
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          clubId,
          name,
          description,
          openDate,
          deadline,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(name);
      expect(response.body.data.description).toBe(description);
      expect(response.body.data.openDate).toBe(openDate.toISOString());
      expect(response.body.data.deadline).toBe(deadline.toISOString());
    });

    it('should return 400 if a field is mandatory field is not provided (in this case deadline)', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (await prisma.club.findFirst())?.id;
      const name = 'Test Application';
      const description = 'Test Description';
      const openDate = new Date();

      const response = await request
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          clubId,
          name,
          description,
          openDate,
        });

      expect(response.status).toBe(400);
    });

    it('should return 500 if club does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidClubId = '-1';
      const name = 'Test Application';
      const description = 'Test Description';
      const openDate = new Date();
      const deadline = new Date();

      const response = await request
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          clubId: invalidClubId,
          name,
          description,
          openDate,
          deadline,
        });

      expect(response.status).toBe(500);
    });
  });

  describe(`POST ${endpoint}/:applicationId/question`, () => {
    it('should create a question for an application', async () => {
      const accessToken = await getTestAccessToken();
      const applicationId = (await prisma.application.findFirst())?.id;
      const value = 'Test Question';

      const response = await request
        .post(`${endpoint}/${applicationId}/question`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          value,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.value).toBe(value);
      expect(response.body.data.applicationId).toBe(applicationId);
    });

    it('should return 400 if a field is mandatory field is not provided (in this case value)', async () => {
      const accessToken = await getTestAccessToken();
      const applicationId = (await prisma.application.findFirst())?.id;

      const response = await request
        .post(`${endpoint}/${applicationId}/question`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 500 if application does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidApplicationId = '-1';

      const response = await request
        .post(`${endpoint}/${invalidApplicationId}/question`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          value: 'Test Question',
        });

      expect(response.status).toBe(500);
    });
  });

  describe(`POST ${endpoint}/:applicationId/scoringCriteria`, () => {
    it('should create a scoring criteria for an application', async () => {
      const accessToken = await getTestAccessToken();
      const applicationId = (await prisma.application.findFirst())?.id;
      const description = 'Test Scoring Criteria';

      const response = await request
        .post(`${endpoint}/${applicationId}/scoringCriteria`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.description).toBe(description);
      expect(response.body.data.applicationId).toBe(applicationId);
    });

    it('should return 400 if a field is mandatory field is not provided (in this case value)', async () => {
      const accessToken = await getTestAccessToken();
      const applicationId = (await prisma.application.findFirst())?.id;

      const response = await request
        .post(`${endpoint}/${applicationId}/scoringCriteria`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 500 if application does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidApplicationId = '-1';

      const response = await request
        .post(`${endpoint}/${invalidApplicationId}/scoringCriteria`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description: 'Test Scoring Criteria',
        });

      expect(response.status).toBe(500);
    });
  });

  describe(`PUT ${endpoint}/:id`, () => {
    it('should update an application', async () => {
      const accessToken = await getTestAccessToken();
      const applicationId = (await prisma.application.findFirst())?.id;
      const name = 'Updated Test Application';
      const description = 'Updated Test Description';
      const openDate = new Date();
      const deadline = new Date();

      const response = await request
        .put(`${endpoint}/${applicationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name,
          description,
          openDate,
          deadline,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(name);
      expect(response.body.data.description).toBe(description);
      expect(response.body.data.openDate).toBe(openDate.toISOString());
      expect(response.body.data.deadline).toBe(deadline.toISOString());
    });

    it('should return 404 if application does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const name = 'Updated Test Application';
      const description = 'Updated Test Description';
      const openDate = new Date();
      const deadline = new Date();

      const response = await request
        .put(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name,
          description,
          openDate,
          deadline,
        });

      expect(response.status).toBe(404);
    });
  });

  describe(`PUT ${endpoint}/question/:questionId`, () => {
    it('should update a question', async () => {
      const accessToken = await getTestAccessToken();
      const questionId = (await prisma.question.findFirst())?.id;
      const value = 'Updated Test Question';

      const response = await request
        .put(`${endpoint}/question/${questionId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          value,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.value).toBe(value);
    });

    it('should return 404 if question does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidQuestionId = '-1';
      const value = 'Updated Test Question';

      const response = await request
        .put(`${endpoint}/question/${invalidQuestionId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          value,
        });

      expect(response.status).toBe(404);
    });

    it('should return 200 if a field is not provided', async () => {
      const accessToken = await getTestAccessToken();
      const question = await prisma.question.findFirst();

      const response = await request
        .put(`${endpoint}/question/${question?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.data.value).toBe(question?.value);
    });
  });

  describe(`PUT ${endpoint}/scoringCriteria/:scoringCriteriaId`, () => {
    it('should update a scoring criteria', async () => {
      const accessToken = await getTestAccessToken();
      const scoringCriteriaId = (await prisma.scoringCriteria.findFirst())?.id;
      const description = 'Updated Test Scoring Criteria';

      const response = await request
        .put(`${endpoint}/scoringCriteria/${scoringCriteriaId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe(description);
    });

    it('should return 404 if scoring criteria does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidScoringCriteriaId = '-1';
      const description = 'Updated Test Scoring Criteria';

      const response = await request
        .put(`${endpoint}/scoringCriteria/${invalidScoringCriteriaId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description,
        });

      expect(response.status).toBe(404);
    });

    it('should return 200 if a field is not provided', async () => {
      const accessToken = await getTestAccessToken();
      const scoringCriteria = await prisma.scoringCriteria.findFirst();

      const response = await request
        .put(`${endpoint}/scoringCriteria/${scoringCriteria?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe(scoringCriteria?.description);
    });
  });

  describe(`DELETE ${endpoint}`, () => {
    it('Should delete an application', async () => {
      const accessToken = await getTestAccessToken();
      const applicationId = (await prisma.application.findFirst())?.id;
      const ogApplicationCount = await prisma.application.count();

      const response = await request
        .delete(`${endpoint}/${applicationId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const newApplicationCount = await prisma.application.count();
      expect(response.status).toBe(200);
      expect(newApplicationCount).toBe(ogApplicationCount - 1);
    });

    it('Should return 404 if application does not exist id', async () => {
      const accessToken = await getTestAccessToken();
      const invalidApplicationId = '-1';

      const ogApplicationCount = await prisma.application.count();
      const response = await request
        .delete(`${endpoint}/${invalidApplicationId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(404);
      expect(await prisma.application.count()).toBe(ogApplicationCount);
    });
  });

  describe(`DELETE ${endpoint}/question/:questionId`, () => {
    it('Should delete a question', async () => {
      const accessToken = await getTestAccessToken();
      const questionId = (await prisma.question.findFirst())?.id;
      const ogQuestionCount = await prisma.question.count();

      const response = await request
        .delete(`${endpoint}/question/${questionId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const newQuestionCount = await prisma.question.count();
      expect(response.status).toBe(200);
      expect(newQuestionCount).toBe(ogQuestionCount - 1);
    });

    it('Should return 404 if question does not exist id', async () => {
      const accessToken = await getTestAccessToken();
      const invalidQuestionId = '-1';

      const ogQuestionCount = await prisma.question.count();
      const response = await request
        .delete(`${endpoint}/question/${invalidQuestionId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(404);
      expect(await prisma.question.count()).toBe(ogQuestionCount);
    });


  
  });

  describe(`DELETE ${endpoint}/scoringCriteria/:scoringCriteriaId`, () => {
    it('Should delete a scoring criteria', async () => {
      const accessToken = await getTestAccessToken();
      const scoringCriteriaId = (await prisma.scoringCriteria.findFirst())?.id;
      const ogScoringCriteriaCount = await prisma.scoringCriteria.count();

      const response = await request
        .delete(`${endpoint}/scoringCriteria/${scoringCriteriaId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      const newScoringCriteriaCount = await prisma.scoringCriteria.count();
      expect(response.status).toBe(200);
      expect(newScoringCriteriaCount).toBe(ogScoringCriteriaCount - 1);
    });

    it('Should return 404 if scoring criteria does not exist id', async () => {
      const accessToken = await getTestAccessToken();
      const invalidScoringCriteriaId = '-1';

      const ogScoringCriteriaCount = await prisma.scoringCriteria.count();
      const response = await request
        .delete(`${endpoint}/scoringCriteria/${invalidScoringCriteriaId}`)
        .set('Authorization', `Bearer ${accessToken}`); 
      expect(response.status).toBe(404);
      expect(await prisma.scoringCriteria.count()).toBe(ogScoringCriteriaCount);
    });
  });
});
