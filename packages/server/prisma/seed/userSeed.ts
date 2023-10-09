import axios from 'axios';

import prisma from '../client';

const queryToAuth0ForUsers = {
  method: 'GET',
  url: 'https://dev-f1yfgf6nxnx2wn2m.us.auth0.com/api/v2/users',
  params: { q: 'identities.connection:"google-oauth2"', search_engine: 'v3' },
  headers: {
    authorization: `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
  },
};

export const generateUsers = async (count: number) => {
  const { data } = await axios.request(queryToAuth0ForUsers);

  for (let i = 0; i < count && i < data.length; i++) {
    const { user_id, name, email } = data[i];

    await prisma.user.create({
      data: {
        auth0_Id: user_id,
        name,
        email,
      },
    });
  }
};

export const generateUsersWithoutValidAuth0ID = async (count: number) => {
  for (let i = 0; i < count; i++) {
    await prisma.user.create({
      data: {
        auth0_Id: `auth0|${i}`,
      },
    });
  }
};

export const deleteUsers = prisma.user.deleteMany();
