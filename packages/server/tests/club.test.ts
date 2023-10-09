import supertest from 'supertest';

import prisma from '../prisma/client';
import {
  deleteClubProfiles,
  deleteClubs,
  generateClub,
  generateClubProfile,
} from '../prisma/seed/clubSeed';
import app from '../src/app';
import getTestAccessToken from './utils/getTestAccessToken';

const request = supertest(app);
const endpoint = '/api/club';

describe(`Test ${endpoint}`, () => {
  beforeEach(async () => {
    for (let i = 0; i < 4; i++) {
      const clubId = (await generateClub(true))?.id;
      if (i > 2) {
        await generateClubProfile(clubId);
      }
    }
  });

  afterEach(async () => {
    await prisma.$transaction([deleteClubProfiles, deleteClubs]);
  });

  describe(`GET ${endpoint}/:id`, () => {
    it('should get a club by id', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (await prisma.club.findFirst())?.id;

      const response = await request
        .get(`${endpoint}/${clubId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(clubId);
    });

    it('should return 404 if club does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const response = await request
        .get(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe(`GET ${endpoint}/:clubId/clubProfile`, () => {
    it('should get a club profile by club id', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (
        await prisma.club.findFirst({
          where: {
            NOT: {
              clubProfile: null,
            },
          },
        })
      )?.id;

      const response = await request
        .get(`${endpoint}/${clubId}/clubProfile`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.clubId).toBe(clubId);
    });

    it('should return 404 if club does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const response = await request
        .get(`${endpoint}/${invalidId}/clubProfile`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 404 if club profile does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (
        await prisma.club.findFirst({
          where: {
            clubProfile: null,
          },
        })
      )?.id;

      const response = await request
        .get(`${endpoint}/${clubId}/clubProfile`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe(`POST ${endpoint}`, () => {
    it('should create a new club', async () => {
      const accessToken = await getTestAccessToken();
      const name = 'Test Club';
      const response = await request
        .post(`${endpoint}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(name);
    });

    it('should return 400 if name is not provided', async () => {
      const accessToken = await getTestAccessToken();
      const response = await request
        .post(`${endpoint}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 404 if name provided already exists', async () => {
      const accessToken = await getTestAccessToken();
      const name = (await prisma.club.findFirst())?.name;

      const response = await request
        .post(`${endpoint}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name });

      expect(response.status).toBe(400);
    });
  });

  describe(`POST ${endpoint}/:id/clubProfile`, () => {
    it('should create a new club profile', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (await prisma.club.findFirst())?.id;
      const description = 'Test Club Description';
      const applicationCycleDescription = 'Test Application Cycle Description';
      const clubSizeDescription = 'Test Club Size Description';

      const response = await request
        .post(`${endpoint}/${clubId}/clubProfile`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description,
          applicationCycleDescription,
          clubSizeDescription,
        });

      expect(response.status).toBe(201);
      expect(response.body.data.description).toBe(description);
      expect(response.body.data.applicationCycleDescription).toBe(
        applicationCycleDescription,
      );
      expect(response.body.data.clubSizeDescription).toBe(clubSizeDescription);
    });

    it('should return 404 if club does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const description = 'Test Club Description';
      const applicationCycleDescription = 'Test Application Cycle Description';
      const clubSizeDescription = 'Test Club Size Description';

      const response = await request
        .post(`${endpoint}/${invalidId}/clubProfile`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description,
          applicationCycleDescription,
          clubSizeDescription,
        });

      expect(response.status).toBe(500);
    });

    it('should return 400 a field is missing(ie. description)', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (await prisma.club.findFirst())?.id;
      const applicationCycleDescription = 'Test Application Cycle Description';
      const clubSizeDescription = 'Test Club Size Description';

      const response = await request
        .post(`${endpoint}/${clubId}/clubProfile`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          applicationCycleDescription,
          clubSizeDescription,
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 if club profile already exists', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (
        await prisma.club.findFirst({
          where: {
            NOT: {
              clubProfile: null,
            },
          },
        })
      )?.id;
      const description = 'Test Club Description';
      const applicationCycleDescription = 'Test Application Cycle Description';
      const clubSizeDescription = 'Test Club Size Description';

      const response = await request
        .post(`${endpoint}/${clubId}/clubProfile`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description,
          applicationCycleDescription,
          clubSizeDescription,
        });

      expect(response.status).toBe(400);
    });
  });

  describe(`PUT ${endpoint}/:id`, () => {
    it('should update a club', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (await prisma.club.findFirst())?.id;
      const name = 'Updated Club Name';

      const response = await request
        .put(`${endpoint}/${clubId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe(name);
    });

    it('should return 404 if club does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const name = 'Updated Club Name';

      const response = await request
        .put(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name });

      expect(response.status).toBe(404);
    });
  });

  describe(`PUT ${endpoint}/:id/clubProfile`, () => {
    it('should update a club profile', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (
        await prisma.club.findFirst({
          where: {
            NOT: {
              clubProfile: null,
            },
          },
        })
      )?.id;

      const description = 'Updated Club Description';
      const applicationCycleDescription =
        'Updated Application Cycle Description';
      const clubSizeDescription = 'Updated Club Size Description';

      const response = await request
        .put(`${endpoint}/${clubId}/clubProfile`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description,
          applicationCycleDescription,
          clubSizeDescription,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.description).toBe(description);
      expect(response.body.data.applicationCycleDescription).toBe(
        applicationCycleDescription,
      );
      expect(response.body.data.clubSizeDescription).toBe(clubSizeDescription);
    });

    it('should return 404 if club does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const description = 'Updated Club Description';
      const applicationCycleDescription =
        'Updated Application Cycle Description';
      const clubSizeDescription = 'Updated Club Size Description';

      const response = await request
        .put(`${endpoint}/${invalidId}/clubProfile`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description,
          applicationCycleDescription,
          clubSizeDescription,
        });

      expect(response.status).toBe(404);
    });

    it('should return 400 if club profile does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (await prisma.club.findFirst())?.id;
      const description = 'Updated Club Description';
      const applicationCycleDescription =
        'Updated Application Cycle Description';
      const clubSizeDescription = 'Updated Club Size Description';

      const response = await request
        .put(`${endpoint}/${clubId}/clubProfile`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description,
          applicationCycleDescription,
          clubSizeDescription,
        });

      expect(response.status).toBe(404);
    });
  });

  describe(`DELETE ${endpoint}/:id`, () => {
    it('should delete a club', async () => {
      const accessToken = await getTestAccessToken();
      const clubId = (await prisma.club.findFirst())?.id;

      const response = await request
        .delete(`${endpoint}/${clubId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });

    it('should return 404 if club does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';

      const response = await request
        .delete(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });
});
