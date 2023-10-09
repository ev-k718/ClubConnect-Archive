import axios from 'axios';
import type { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

import ApiError from '../../model/ApiError';
import prisma from '../../prisma/client';

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
export const checkJWT = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',
});

const fetchUserFromAuth0 = async (sub: string) => {
  const options = {
    method: 'GET',
    url: `https://dev-f1yfgf6nxnx2wn2m.us.auth0.com/api/v2/users/${sub}`,
    headers: {
      authorization: `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
    },
  };

  return await axios.request(options);
};

const updateUserWithAuth0Data = async (sub: string) => {
  const data = await fetchUserFromAuth0(sub);
  const { email, name } = data.data;
  return await prisma.user.update({
    where: {
      auth0_Id: sub,
    },
    data: {
      name,
      email,
    },
    include: {
      clubMemberships: true,
      clubsOwned: true,
      applicationSubmissions: true,
    },
  });
};

export const handleUserCreation = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const auth = req.auth;

    if (auth?.payload && auth.payload.sub) {
      // sub is the Auth0 user ID
      const { sub } = auth.payload;

      let user = await prisma.user.upsert({
        where: {
          auth0_Id: sub,
        },
        create: {
          auth0_Id: sub,
        },
        update: {},
        include: {
          clubMemberships: true,
          clubsOwned: true,
          applicationSubmissions: true,
        },
      });

      if (user.email === null || user.name === null) {
        user = await updateUserWithAuth0Data(sub);
      }

      req.user = user;
    } else {
      throw new ApiError(400, 'Malformed Auth0 JWT');
    }
  } catch (err) {
    next(err);
  }
  next();
};
