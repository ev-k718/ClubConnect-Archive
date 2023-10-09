import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import supertest from 'supertest';

import prisma from '../prisma/client';
import { getSome } from '../prisma/helper';
import {
  deleteApplications,
  generateFullApplication,
} from '../prisma/seed/applicationSeed';
import { deleteClubs, generateClub } from '../prisma/seed/clubSeed';
import {
  deleteAnswers,
  deleteApplicationSubmissions,
  generateDraftSubmissions,
  generateSubmittedSubmission,
} from '../prisma/seed/submissionSeed';
import {
  deleteUsers,
  generateUsersWithoutValidAuth0ID,
} from '../prisma/seed/userSeed';
import app from '../src/app';
import getTestAccessToken from './utils/getTestAccessToken';

const request = supertest(app);
const endpoint = '/api/applicationSubmission';

describe(`Test ${endpoint}`, () => {
  beforeEach(async () => {
    await generateUsersWithoutValidAuth0ID(10);
    for (let i = 0; i < 4; i++) {
      const clubId = (await generateClub(true)).id;
      const applicationId = (await generateFullApplication(clubId)).id;
      const submissions = await generateDraftSubmissions(applicationId);
      const s = getSome(submissions, 1);
      await generateSubmittedSubmission(s[0].id);
    }
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
    it('should get an application submission by id', async () => {
      const accessToken = await getTestAccessToken();
      const applicationSubmissionId = (await prisma.applicationSubmission.findFirst({}))
        ?.id;

      const res = await request
        .get(`${endpoint}/${applicationSubmissionId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(applicationSubmissionId);
      expect(res.body.data.status).toBeDefined();
      expect(res.body.data.answers).toBeDefined();
      expect(res.body.data.answers).toBeDefined();
    });

    it('should return 404 if application submission does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const res = await request
        .get(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe(`GET ${endpoint}/getApplicationSubmissionForApplicant/:applicantId`, () => {
    it('should get all application submissions by applicant id', async () => {
      const accessToken = await getTestAccessToken();
      const applicantId = (
        await prisma.user.findFirst({
          where: {
            applicationSubmissions: {
              some: {},
            },
          },
        })
      )?.id;

      const res = await request
        .get(`${endpoint}/getApplicationSubmissionForApplicant/${applicantId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].answers).toBeDefined();
    });

    it('should return 200 if applicant does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const res = await request
        .get(`${endpoint}/getApplicationSubmissionForApplicant/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe(`GET ${endpoint}/getCompletedSubmissionForApplication/:applicationId`, () => {
    it('should get all completed application submissions by application id', async () => {
      const accessToken = await getTestAccessToken();
      const applicationId = (
        await prisma.application.findFirst({
          where: {
            submissions: {
              some: {
                status: 'SUBMITTED',
              },
            },
          },
        })
      )?.id;

      const res = await request
        .get(
          `${endpoint}/getCompletedSubmissionForApplication/${applicationId}`,
        )
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].answers).toBeDefined();
    });

    it('should return 404 if application does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const res = await request
        .get(`${endpoint}/getCompletedSubmissionForApplication/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });
  });


  describe(`POST ${endpoint}`, () => {
    it('should create a new application submission', async () => {
      const accessToken = await getTestAccessToken();
      const applicantId = (await prisma.user.findFirst({}))?.id;
      await prisma.applicationSubmission.deleteMany({
        where: {
          applicantId,
        },
      });
      const applicationId = (await prisma.application.findFirst({}))?.id;

      const res = await request
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          applicationId,
          applicantId,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.status).toBe('DRAFT');
      expect(res.body.data.answers).toBeDefined();
    });

    it('should return 500 if application id is invalid', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const applicantId = (await prisma.user.findFirst({}))?.id;

      const res = await request
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          applicationId: invalidId,
          applicantId,
        });

      expect(res.status).toBe(500);
    });

    it('should return 500 if applicant id is invalid', async () => {
      const accessToken = await getTestAccessToken();
      const applicationId = (await prisma.application.findFirst({}))?.id;
      const invalidId = '-1';

      const res = await request
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          applicationId,
          applicantId: invalidId,
        });

      expect(res.status).toBe(500);
    });

    it('should return 400 if application submission already exists', async () => {
      const accessToken = await getTestAccessToken();
      const existingApplicationSub =
        await prisma.applicationSubmission.findFirst({});

      const res = await request
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          applicationId: existingApplicationSub?.applicationId,
          applicantId: existingApplicationSub?.applicantId,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(
        'A record with the same applicantId,applicationId already exists.',
      );
    });
  });

  describe(`PUT ${endpoint}/submitApplicationSubmission/:id`, () => {
    const CURR_ENDPOINT = `${endpoint}/submitApplicationSubmission`;

    it('should submit an application submission that is in DRAFT', async () => {
      const accessToken = await getTestAccessToken();
      const applicationSubmissionId = (
        await prisma.applicationSubmission.findFirst({
          where: {
            status: 'DRAFT',
          },
        })
      )?.id;

      const res = await request
        .put(`${CURR_ENDPOINT}/${applicationSubmissionId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('SUBMITTED');
      expect(res.body.data.submittedAt).toBeDefined();
    });

    it('should return 400 if application submission does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const res = await request
        .put(`${CURR_ENDPOINT}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });

    it('should return 400 if application submission is already submitted', async () => {
      const accessToken = await getTestAccessToken();
      const existingApplicationSub =
        await prisma.applicationSubmission.findFirst({
          where: {
            status: 'SUBMITTED',
          },
        });
      const res = await request
        .put(`${CURR_ENDPOINT}/${existingApplicationSub?.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe(`DELETE ${endpoint}/:id`, () => {
    it('should delete an application submission', async () => {
      const accessToken = await getTestAccessToken();
      const applicationSubId = (await prisma.applicationSubmission.findFirst({}))?.id;

      const res = await request
        .delete(`${endpoint}/${applicationSubId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(applicationSubId);
    });

    it('should return 404 if application submission does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const res = await request
        .delete(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });
});
