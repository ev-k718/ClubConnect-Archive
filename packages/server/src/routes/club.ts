// Club API for CRUD operations on clubs
import { Router } from 'express';
import { string } from 'zod';

import ApiError from '../../model/ApiError';
import prisma from '../../prisma/client';
import { userIsClubOwner } from '../middleware/checkOwner';

const router = Router();
const endpoint = '/club';

// Get clubs
router.get(`${endpoint}`, async (req, res, next) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        members: true,
        clubProfile: true,
      },
    });
    return res.status(200).json({ data: clubs });
  } catch (err) {
    next(err);
  }
});

// Get a club by ID
router.get(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const club = await prisma.club.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        clubProfile: {
          include: {
            contactInfo: true,
            timelineEvents: {
              orderBy: {
                time: 'asc',
              },
            },
            socialMedia: true,
          },
        },
        applications: {
          include: {
            questions: {
              orderBy: {
                index: 'asc',
              },
            }
          },
        },
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    return res.status(200).json({ data: club });
  } catch (err) {
    next(err);
  }
});

// Get a club by ID
router.get(`${endpoint}/:id/liveapps`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const club = await prisma.club.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        clubProfile: {
          include: {
            contactInfo: true,
            timelineEvents: {
              orderBy: {
                time: 'asc',
              },
            },
            socialMedia: true,
          },
        },
        applications: {
          where: {
            status: 'LIVE',
          },
          include: {
            questions: {
              orderBy: {
                index: 'asc',
              },
            }
          },
        },
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    return res.status(200).json({ data: club });
  } catch (err) {
    next(err);
  }
});

router.get(`${endpoint}/getClubOwners/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const clubOwners = await prisma.club.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        owners: true,
      },
    });
    return res.status(200).json({ data: clubOwners });
  } catch (err) {
    next(err);
  }
});

//get club name by ID
router.get(`${endpoint}/clubName/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;

    const name = await prisma.club.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        name: true,
      },
    });

    return res.status(200).json({ data: name });
  } catch (err) {
    next(err);
  }
});

router.get(`${endpoint}/:clubId/clubProfile`, async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const clubProfile = await prisma.clubProfile.findUniqueOrThrow({
      where: { clubId },
      include: {
        contactInfo: true,
        timelineEvents: true,
        socialMedia: true,
      },
    });
    return res.status(200).json({ data: clubProfile });
  } catch (err) {
    next(err);
  }
});

// Create a new club
router.post(`${endpoint}`, async (req, res, next) => {
  try {
    const { name } = req.body;
    const newClub = await prisma.club.create({
      data: {
        name,
      },
    });
    res.status(200).json({ message: 'Club created', data: newClub });
  } catch (err) {
    next(err);
  }
});

router.post(`${endpoint}/:clubId/clubProfile`, async (req, res, next) => {
  try {
    const { clubId } = req.params;

    if (!(await userIsClubOwner(req.user, clubId))) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }
    const { description, applicationCycleDescription, clubSizeDescription } =
      req.body;
    const newClubProfile = await prisma.clubProfile.create({
      data: {
        clubId,
        description,
        applicationCycleDescription,
        clubSizeDescription,
      },
    });

    res
      .status(201)
      .json({ message: 'Club Contact Info created', data: newClubProfile });
  } catch (err) {
    next(err);
  }
});

// Update an existing club (change club name)
router.put(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!(await userIsClubOwner(req.user, id))) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }
    const updatedClub = await prisma.club.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    res.status(200).json({ message: 'Updated club', data: updatedClub });
  } catch (err) {
    next(err);
  }
});

//adds the given user to the club's owners[]
router.put(`${endpoint}/addOwner/:clubId`, async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const { userId } = req.body;

    //check if user is already an owner of the club using the user table
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        clubsOwned: {
          where: {
            id: clubId,
          },
        },
      },
    });

    if (user.clubsOwned.length > 0) {
      throw new ApiError(400, 'User is already an owner of this club');
    }

    const newOwner = await prisma.club.update({
      where: { id: clubId },
      data: { owners: { connect: { id: userId } } },
    });
    res.status(200).json({ message: 'New Owner added', data: newOwner });
  } catch (err) {
    next(err);
  }
});

router.put(`${endpoint}/:clubId/clubProfile`, async (req, res, next) => {
  try {
    const { clubId } = req.params;

    const { description, applicationCycleDescription, clubSizeDescription } =
      req.body;

    if (!(await userIsClubOwner(req.user, clubId))) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }
    const updatedClubProfile = await prisma.clubProfile.update({
      where: {
        clubId,
      },
      data: {
        description,
        applicationCycleDescription,
        clubSizeDescription,
      },
    });
    res
      .status(200)
      .json({ message: 'Updated club profile', data: updatedClubProfile });
  } catch (err) {
    next(err);
  }
});

router.put(
  `${endpoint}/removeOwner/:clubId/:userId`,
  async (req, res, next) => {
    try {
      const { clubId, userId } = req.params;

      if (req.user.id === userId) {
        throw new ApiError(400, 'You cannot remove yourself as an owner');
      }

      const club = await prisma.club.findUniqueOrThrow({
        where: {
          id: clubId,
        },
        select: {
          owners: true,
        },
      });

      if (club.owners.length === 1) {
        throw new ApiError(400, 'Cannot remove last owner of club');
      }

      const updatedClub = await prisma.club.update({
        where: {
          id: clubId,
        },
        data: {
          owners: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
      res.status(200).json({ message: 'Removed owner', data: updatedClub });
    } catch (err) {
      next(err);
    }
  },
);

// Delete an existing club (and everything that depends on this club)
router.delete(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!(await userIsClubOwner(req.user, id))) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }
    await prisma.club.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: 'Deleted Club', data: { id } });
  } catch (err) {
    next();
  }
});

export default router;
