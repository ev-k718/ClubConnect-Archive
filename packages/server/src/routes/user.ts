// User API
import { Router } from 'express';

import prisma from '../../prisma/client';

const router = Router();
const endpoint = '/user';

router.get(`${endpoint}/getClubsOwnedAndMemberOf`, async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        clubsOwned: true,
        clubMemberships: true,
      },
    });
    return res.status(200).json({
      message: 'Getting clubs owned and member of',
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

//given email, return the user
router.get(`${endpoint}/getUserGivenEmail/:email`, async (req, res, next) => {
  try {
    const { email } = req.params;
    console.log(email);
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
    });
    return res.status(200).json({
      message: 'Got user w that email',
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

//get own user info
router.get(`${endpoint}/getOwnUserInfo`, async (req, res, next) => {
  const { id } = req.user;
  return res.status(200).json({
    data: id
  })
});

export default router;
