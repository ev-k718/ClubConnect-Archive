import supertest from 'supertest';

import prisma from '../prisma/client';
import { deleteUsers } from '../prisma/seed/userSeed';
import app from '../src/app';
import getTestAccessToken from './utils/getTestAccessToken';

const request = supertest(app);

describe('Test auth middleware', () => {
  afterEach(async () => {
    await prisma.$transaction([deleteUsers]);
  });

  it('GET / without token', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(401);
  });

  it('GET / with token and ensure user creation works', async () => {
    const accessToken = await getTestAccessToken();
    const ogNUmUsers = await prisma.user.count();

    const response = await request
      .get('/')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Welcome to HopCC's API!");
    const newNumUsers = await prisma.user.count();
    expect(newNumUsers).toBe(ogNUmUsers + 1);
  });
});
