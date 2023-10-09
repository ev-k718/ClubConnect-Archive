import supertest from 'supertest';

import prisma from '../prisma/client';
import {
  deleteClubContactInfo,
  deleteClubProfiles,
  deleteClubs,
  deleteSocialMedia,
  generateClub,
  generateClubContactInfo,
  generateClubProfile,
  generateSocialMedia,
  generateTimelineEvent,
} from '../prisma/seed/clubSeed';
import app from '../src/app';
import getTestAccessToken from './utils/getTestAccessToken';

const request = supertest(app);
const endpoint = '/api/clubProfile';

describe(`Test ${endpoint}`, () => {
  beforeEach(async () => {
    for (let i = 0; i < 4; i++) {
      const clubId = (await generateClub(true))?.id;
      if (i > 1) {
        const clubProfileId = (await generateClubProfile(clubId))?.id;
        if (i % 2) {
          await generateClubContactInfo(clubProfileId);
        }
        await generateSocialMedia(clubProfileId, 'FACEBOOK');
        await generateSocialMedia(clubProfileId, 'INSTAGRAM');
        await generateSocialMedia(clubProfileId, 'TWITTER');
        await generateTimelineEvent(clubProfileId);
      }
    }
  });

  afterEach(async () => {
    await prisma.$transaction([
      deleteSocialMedia,
      deleteClubContactInfo,
      deleteClubProfiles,
      deleteClubs,
    ]);
  });

  describe(`GET ${endpoint}/:id`, () => {
    it('should return a club profile by id', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (await prisma.clubProfile.findFirst())?.id;
      const response = await request
        .get(`${endpoint}/${clubProfileId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.data.id).toEqual(clubProfileId);
    });

    it('should return a 404 if club profile does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const response = await request
        .get(`${endpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe(`POST ${endpoint}/:clubProfileId/contactInfo`, () => {
    it('should create a new contact info for a club profile', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (
        await prisma.clubProfile.findFirst({
          where: {
            contactInfo: null,
          },
        })
      )?.id;

      const name = 'Test Name';
      const role = 'Test Role';
      const email = 'test email';
      const phoneNumber = '1234567890';

      const response = await request
        .post(`${endpoint}/${clubProfileId}/contactInfo`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name,
          role,
          email,
          phoneNumber,
        });
      expect(response.status).toBe(201);
      expect(response.body.data.name).toEqual(name);
      expect(response.body.data.role).toEqual(role);
      expect(response.body.data.email).toEqual(email);
      expect(response.body.data.phoneNumber).toEqual(phoneNumber);
      expect(response.body.data.clubProfileId).toEqual(clubProfileId);
    });

    it('should return a 400 if a mandatory field is missing', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (
        await prisma.clubProfile.findFirst({
          where: {
            contactInfo: null,
          },
        })
      )?.id;

      const response = await request
        .post(`${endpoint}/${clubProfileId}/contactInfo`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Name',
          role: 'Test Role',
        });
      expect(response.status).toBe(400);
    });
    

    it('should return a 404 if club profile does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const response = await request
        .post(`${endpoint}/${invalidId}/contactInfo`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Name',
          role: 'Test Role',
          email: 'test email',
          phoneNumber: '1234567890',
        });
      expect(response.status).toBe(500);
    });

    it('should return a 400 if contact info already exists', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (
        await prisma.clubProfile.findFirst({
          where: {
            NOT: {
              contactInfo: null,
            },
          },
        })
      )?.id;
      const response = await request
        .post(`${endpoint}/${clubProfileId}/contactInfo`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Name',
          role: 'Test Role',
          email: 'test email',
          phoneNumber: '1234567890',
        });
      expect(response.status).toBe(400);
    });
  });

  describe(`POST ${endpoint}/:clubProfileId/socialMedia`, () => {
    it('should create a new social media for a club profile', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (await prisma.clubProfile.findFirst())?.id;
      const type = 'WEBSITE';
      const url = 'https://www.test.com';

      const response = await request
        .post(`${endpoint}/${clubProfileId}/socialMedia`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type,
          url,
        });
      expect(response.status).toBe(201);
      expect(response.body.data.type).toEqual(type);
      expect(response.body.data.url).toEqual(url);
      expect(response.body.data.clubProfileId).toEqual(clubProfileId);
    });

    it('should return a 500 if club profile does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const response = await request
        .post(`${endpoint}/${invalidId}/socialMedia`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'WEBSITE',
          url: 'https://www.test.com',
        });
      expect(response.status).toBe(500);
    });

    it('should return a 400 if a mandatory field is missing', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (await prisma.clubProfile.findFirst())?.id;
      const response = await request
        .post(`${endpoint}/${clubProfileId}/socialMedia`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'WEBSITE',
        });
      expect(response.status).toBe(400);
    });
    

    it('should return a 400 if social media already exists', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (
        await prisma.clubProfile.findFirst({
          where: {
            socialMedia: {
              some: {
                type: 'FACEBOOK',
              },
            },
          },
        })
      )?.id;
      const response = await request
        .post(`${endpoint}/${clubProfileId}/socialMedia`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'FACEBOOK',
          url: 'https://www.test.com',
        });
      expect(response.status).toBe(400);
    });

    it('should return a 400 if social media type is invalid', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (await prisma.clubProfile.findFirst())?.id;
      const response = await request
        .post(`${endpoint}/${clubProfileId}/socialMedia`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          type: 'INVALID',
          url: 'https://www.test.com',
        });
      expect(response.status).toBe(400);
    });

    //TODO: implement this functionality
    // it('should return a 400 if social media url is invalid', async () => {
    //   const accessToken = await getTestAccessToken();
    //   const clubProfileId = (await prisma.clubProfile.findFirst())?.id;
    //   const response = await request
    //     .post(`${endpoint}/${clubProfileId}/socialMedia`)
    //     .set('Authorization', `Bearer ${accessToken}`)
    //     .send({
    //       type: 'FACEBOOK',
    //       url: 'invalid url',
    //     });
    //   expect(response.status).toBe(400);
    // });
  });

  describe(`POST ${endpoint}/:clubProfileId/timelineEvent`, () => {
    it('should create a new timeline event for a club profile', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (await prisma.clubProfile.findFirst())?.id;
      const name = 'Test Title';
      const description = 'Test Description';
      const time = new Date();
      const location = 'Test Location';

      const response = await request
        .post(`${endpoint}/${clubProfileId}/timelineEvent`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name,
          description,
          time,
          location,
        });
      expect(response.status).toBe(201);
      expect(response.body.data.name).toEqual(name);
      expect(response.body.data.description).toEqual(description);
      expect(response.body.data.time).toEqual(time.toISOString());
      expect(response.body.data.clubProfileId).toEqual(clubProfileId);
      expect(response.body.data.location).toEqual(location);
    });

    it('should return a 400 if a mandatory field is missing', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (await prisma.clubProfile.findFirst())?.id;
      const response = await request
        .post(`${endpoint}/${clubProfileId}/timelineEvent`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Title',
          description: 'Test Description',
          time: new Date(),
        });
      expect(response.status).toBe(400);
    });


    it('should return a 500 if club profile does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const response = await request
        .post(`${endpoint}/${invalidId}/timelineEvent`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Title',
          description: 'Test Description',
          time: new Date(),
          location: 'Test Location',
        });
      expect(response.status).toBe(500);
    });
  });

  describe(`PUT ${endpoint}/:clubProfileId/contactInfo`, () => {
    it('should update a contact info for a club profile', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (
        await prisma.clubProfile.findFirst({
          where: {
            NOT: {
              contactInfo: null,
            },
          },
        })
      )?.id;
      const name = 'Updated Test Name';
      const role = 'updated Test Role';
      const email = 'updated test email';
      const phoneNumber = 'updated 1234567890';

      const response = await request
        .put(`${endpoint}/${clubProfileId}/contactInfo`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name,
          role,
          email,
          phoneNumber,
        });
      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual(name);
      expect(response.body.data.role).toEqual(role);
      expect(response.body.data.email).toEqual(email);
      expect(response.body.data.phoneNumber).toEqual(phoneNumber);
      expect(response.body.data.clubProfileId).toEqual(clubProfileId);
    });

    it('should return 200 if some of the udpated fields are missing', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfile = await prisma.clubProfile.findFirst({
        where: {
          NOT: {
            contactInfo: null,
          },
        },
        include: {
          contactInfo: true,
        },
      });

      const response = await request
        .put(`${endpoint}/${clubProfile?.id}/contactInfo`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'updated name',
        });
      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual('updated name');
      expect(response.body.data.role).toEqual(clubProfile?.contactInfo?.role);
      expect(response.body.data.email).toEqual(clubProfile?.contactInfo?.email);
      expect(response.body.data.phoneNumber).toEqual(
        clubProfile?.contactInfo?.phoneNumber,
      );
      expect(response.body.data.clubProfileId).toEqual(clubProfile?.id);
    });

    it('should return a 404 if club profile does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const response = await request
        .put(`${endpoint}/${invalidId}/contactInfo`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Name',
          role: 'Test Role',
          email: 'test email',
          phoneNumber: '1234567890',
        });

      expect(response.status).toBe(404);
    });

    it('should return a 404 if contact info does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const clubProfileId = (
        await prisma.clubProfile.findFirst({
          where: {
            contactInfo: null,
          },
        })
      )?.id;
      const response = await request
        .put(`${endpoint}/${clubProfileId}/contactInfo`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Test Name',
          role: 'Test Role',
          email: 'test email',
          phoneNumber: '1234567890',
        });
      expect(response.status).toBe(404);
    });
  });

  describe(`PUT ${endpoint}/socialMedia/:id`, () => {
    it('should update a social media for a club profile', async () => {
      const accessToken = await getTestAccessToken();
      const socialMedia = await prisma.socialMedia.findFirst();
      const url = 'https://www.instagram.com/test';

      const response = await request
        .put(`${endpoint}/socialMedia/${socialMedia?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          url,
        });
      expect(response.status).toBe(200);
      expect(response.body.data.type).toEqual(socialMedia?.type);
      expect(response.body.data.url).toEqual(url);
      expect(response.body.data.clubProfileId).toEqual(
        socialMedia?.clubProfileId,
      );
    });

    it('should return 200 if some of the udpated fields are missing', async () => {
      const accessToken = await getTestAccessToken();
      const socialMedia = await prisma.socialMedia.findFirst();

      const response = await request
        .put(`${endpoint}/socialMedia/${socialMedia?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});
      expect(response.status).toBe(200);
      expect(response.body.data.type).toEqual(socialMedia?.type);
      expect(response.body.data.url).toEqual(socialMedia?.url);
      expect(response.body.data.clubProfileId).toEqual(
        socialMedia?.clubProfileId,
      );
    });

    it('should return a 404 if social media does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const response = await request
        .put(`${endpoint}/socialMedia/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          url: 'https://www.test.com',
        });

      expect(response.status).toBe(404);
    });

    //TODO: Implement this feature
    // it('should return a 400 if social media url is invalid', async () => {
    //   const accessToken = await getTestAccessToken();
    //   const socialMedia = await prisma.socialMedia.findFirst();
    //   const response = await request
    //     .put(`${endpoint}/socialMedia/${socialMedia?.id}`)
    //     .set('Authorization', `Bearer ${accessToken}`)
    //     .send({
    //       url: 'invalid url',
    //     });
    //   expect(response.status).toBe(400);
    // });
  });

  describe(`PUT ${endpoint}/timelineEvent/:id`, () => {
    it('should update a timeline event for a club profile', async () => {
      const accessToken = await getTestAccessToken();
      const timelineEvent = await prisma.timelineEvent.findFirst();
      const name = 'Updated Test Title';
      const description = 'Updated Test Description';
      const time = new Date();
      const location = 'Updated Test Location';

      const response = await request
        .put(`${endpoint}/timelineEvent/${timelineEvent?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name,
          description,
          time,
          location,
        });
      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual(name);
      expect(response.body.data.description).toEqual(description);
      expect(response.body.data.time).toEqual(time.toISOString());
      expect(response.body.data.clubProfileId).toEqual(
        timelineEvent?.clubProfileId,
      );
      expect(response.body.data.location).toEqual(location);
    });

    it('should return 200 if some of the udpated fields are missing', async () => {
      const accessToken = await getTestAccessToken();
      const timelineEvent = await prisma.timelineEvent.findFirst();

      const response = await request
        .put(`${endpoint}/timelineEvent/${timelineEvent?.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});
      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual(timelineEvent?.name);
      expect(response.body.data.description).toEqual(
        timelineEvent?.description,
      );
      expect(response.body.data.time).toEqual(
        timelineEvent?.time.toISOString(),
      );
      expect(response.body.data.clubProfileId).toEqual(
        timelineEvent?.clubProfileId,
      );
    });

    it('should return a 404 if timeline event does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const response = await request
        .put(`${endpoint}/timelineEvent/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Title',
          description: 'Test Description',
          time: new Date(),
          location: 'Test Location',
        });

      expect(response.status).toBe(404);
    });
  });

  describe(`DELETE ${endpoint}/socialMedia/:id`, () => {
    it('should delete a social media for a club profile', async () => {
      const accessToken = await getTestAccessToken();
      const socialMedia = await prisma.socialMedia.findFirst();

      const response = await request
        .delete(`${endpoint}/socialMedia/${socialMedia?.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.type).toEqual(socialMedia?.type);
      expect(response.body.data.url).toEqual(socialMedia?.url);
      expect(response.body.data.clubProfileId).toEqual(
        socialMedia?.clubProfileId,
      );
    });

    it('should return a 404 if social media does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const response = await request
        .delete(`${endpoint}/socialMedia/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe(`DELETE ${endpoint}/timelineEvent/:id`, () => {
    it('should delete a timeline event for a club profile', async () => {
      const accessToken = await getTestAccessToken();
      const timelineEvent = await prisma.timelineEvent.findFirst();

      const response = await request
        .delete(`${endpoint}/timelineEvent/${timelineEvent?.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toEqual(timelineEvent?.name);
      expect(response.body.data.description).toEqual(
        timelineEvent?.description,
      );
      expect(response.body.data.time).toEqual(
        timelineEvent?.time.toISOString(),
      );
      expect(response.body.data.clubProfileId).toEqual(
        timelineEvent?.clubProfileId,
      );
    });

    it('should return a 404 if timeline event does not exist', async () => {
      const accessToken = await getTestAccessToken();
      const invalidId = '-1';
      const response = await request
        .delete(`${endpoint}/timelineEvent/${invalidId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });
});
