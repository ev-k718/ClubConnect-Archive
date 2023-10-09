// Club Member API
import { Router } from 'express';

import prisma from '../../prisma/client';

const router = Router();
const endpoint = '/clubMember';

// Delete an existing club member from the Club
router.delete(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.clubMember.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: 'Deleted clubMember', data: { id } });
  } catch (err) {
    next(err);
  }
});

//TODO: add a member to the club
//give clubId and userId

// await prisma.clubMember.create({
//   data: {
//     userId: member.id,
//     clubId,
//   },
// });

//Creates a new club member given a clubId and userId
router.post(`${endpoint}`, async (req, res, next) => {
  try {
    const { clubId, userId } = req.body;
    const newClubMember = await prisma.clubMember.create({
      data: {
        userId,
        clubId,
      },
    });
    res
      .status(200)
      .json({ message: 'ClubMember created', data: newClubMember });
  } catch (err) {
    next(err);
  }
});
export default router;
