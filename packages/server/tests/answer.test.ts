import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import supertest from 'supertest';

import prisma from '../prisma/client';
import {
  deleteApplications,
  generateFullApplication,
} from '../prisma/seed/applicationSeed';
import { deleteClubs, generateClub } from '../prisma/seed/clubSeed';
import {
  deleteAnswers,
  deleteApplicationSubmissions,
  generateDraftSubmissions,
} from '../prisma/seed/submissionSeed';
import {
  deleteUsers,
  generateUsersWithoutValidAuth0ID,
} from '../prisma/seed/userSeed';
import app from '../src/app';
import getTestAccessToken from './utils/getTestAccessToken';

const request = supertest(app);
const endpoint = '/api/answer';

describe(`Test ${endpoint}`, () => {
  beforeEach(async () => {
    await generateUsersWithoutValidAuth0ID(10);
    const clubId = (await generateClub(true)).id;
    const applicationId = (await generateFullApplication(clubId)).id;
    await generateDraftSubmissions(applicationId);
  });

  afterEach(async () => {
    await prisma.$transaction([
      deleteAnswers,
      deleteApplicationSubmissions,
      deleteApplications,
      deleteClubs,
      deleteUsers,
    ]);
  });

  describe(`GET ${endpoint}/:id`, () => {
    it('should get an answer by id', async () => {
      const accessToken = await getTestAccessToken();
      const answerId = (await prisma.answer.findFirst({}))?.id;

      const res = await request
        .get(`${endpoint}/${answerId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(answerId);
    });

    it('should return 404 if answer does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const res = await request
        .get(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe(`GET ${endpoint}/applicationSubmission/:applicationSubmissionId`, () => {
    it('should get all answers for a submission', async () => {
      const accessToken = await getTestAccessToken();
      const appSubId = (await prisma.applicationSubmission.findFirst({}))?.id;

      const res = await request
        .get(`${endpoint}/applicationSubmission/${appSubId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].applicationSubmissionId).toBe(appSubId);
    });

    it('should return 200 if submission does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const res = await request
        .get(`${endpoint}/applicationSubmission/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe(`POST ${endpoint}`, () => {
    it('should create an answer', async () => {
      const accessToken = await getTestAccessToken();
      const applicationSub = await prisma.applicationSubmission.findFirst({
        include: {
          answers: true,
        },
      });

      const questionId = (
        await prisma.question.findFirst({
          where: {
            applicationId: applicationSub?.applicationId,
          },
        })
      )?.id;

      const answerId = applicationSub?.answers[0]?.id;

      await prisma.answer.delete({
        where: {
          id: answerId,
        },
      });

      const reqBody = {
        applicationSubmissionId: applicationSub?.id,
        questionId,
        value: 'test answer',
      };
      const ogAnswerCount = await prisma.answer.count();

      const res = await request
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(reqBody);

      expect(res.status).toBe(201);
      expect(res.body.data.applicationSubmissionId).toBe(
        reqBody.applicationSubmissionId,
      );
      expect(res.body.data.questionId).toBe(reqBody.questionId);
      expect(res.body.data.value).toBe(reqBody.value);
      expect(await prisma.answer.count()).toBe(ogAnswerCount + 1);
    });

    it('should return 400 if an answer already exists is invalid', async () => {
      const accessToken = await getTestAccessToken();
      const applicationSub = await prisma.applicationSubmission.findFirst();
      const questionId = (
        await prisma.question.findFirst({
          where: {
            applicationId: applicationSub?.applicationId,
          },
        })
      )?.id;

      const applicationSubmissionId = applicationSub?.id;
      const value = 'test answer';

      const ogAnswerCount = await prisma.answer.count();
      const res = await request
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          applicationSubmissionId,
          questionId,
          value,
        });

      expect(res.status).toBe(400);
      expect(await prisma.answer.count()).toBe(ogAnswerCount);
    });
  });

  describe('PUT /:id', () => {
    it('should update an answer', async () => {
      const accessToken = await getTestAccessToken();
      const answerId = (await prisma.answer.findFirst({}))?.id;
      const value = 'updated answer';

      const res = await request
        .put(`${endpoint}/${answerId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ value });

      expect(res.status).toBe(200);
      expect(res.body.data.value).toBe(value);
    });

    it('should return 404 if answer does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const reqBody = {
        value: 'updated answer',
      };

      const res = await request
        .put(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(reqBody);

      expect(res.status).toBe(404);
    });
  });

  describe(`DELETE ${endpoint}/:id`, () => {
    it('should delete an answer', async () => {
      const accessToken = await getTestAccessToken();
      const answerId = (await prisma.answer.findFirst({}))?.id;

      const ogAnswerCount = await prisma.answer.count();

      const res = await request
        .delete(`${endpoint}/${answerId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(await prisma.answer.count()).toBe(ogAnswerCount - 1);
    });

    it('should return 404 if answer does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const ogAnswerCount = await prisma.answer.count();

      const res = await request
        .delete(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
      expect(await prisma.answer.count()).toBe(ogAnswerCount);
    });
  });
});
