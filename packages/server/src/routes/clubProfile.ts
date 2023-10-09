import { Router } from 'express';

import ApiError from '../../model/ApiError';
import prisma from '../../prisma/client';
import { userIsClubMemberOrOwner } from '../middleware/checkOwner';

const router = Router();
const endpoint = '/clubProfile';

// Get a club profile by ID
router.get(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;

    const clubProfile = await prisma.clubProfile.findUniqueOrThrow({
      where: { id },
      include: {
        contactInfo: true,
        timelineEvents: {
          orderBy: {
            time: 'asc',
          },
        },
        socialMedia: true,
      },
    });

    return res.status(200).json({ data: clubProfile });
  } catch (err) {
    next(err);
  }
});

//TODO: All request below here should be for owners/members of the club only
//Create contact info for a club profile
router.post(
  `${endpoint}/:clubProfileId/contactInfo`,
  async (req, res, next) => {
    try {
      const { clubProfileId } = req.params;

      const clubProfile = await prisma.clubProfile.findUniqueOrThrow({
        where: { id: clubProfileId },
        include: {
          club: true,
        },
      });

      if (!userIsClubMemberOrOwner(req.user, clubProfile.club.id)) {
        throw new ApiError(401, 'Cannot access object you dont own');
      }

      const { name, email, phoneNumber, role } = req.body;
      const newContactInfo = await prisma.clubContactInfo.create({
        data: {
          clubProfileId,
          name,
          email,
          phoneNumber,
          role,
        },
      });
      return res.status(201).json({ data: newContactInfo });
    } catch (err) {
      next(err);
    }
  },
);

//Creat a social media for a club profile
router.post(
  `${endpoint}/:clubProfileId/socialMedia`,
  async (req, res, next) => {
    try {
      const { clubProfileId } = req.params;

      const clubProfile = await prisma.clubProfile.findUniqueOrThrow({
        where: { id: clubProfileId },
        include: {
          club: true,
        },
      });

      if (!userIsClubMemberOrOwner(req.user, clubProfile.club.id)) {
        throw new ApiError(401, 'Cannot access object you dont own');
      }

      const { type, url } = req.body;
      const newSocialMedia = await prisma.socialMedia.create({
        data: {
          clubProfileId,
          type,
          url,
        },
      });
      return res.status(201).json({ data: newSocialMedia });
    } catch (err) {
      next(err);
    }
  },
);

//Create a timeline event for a club profile
router.post(
  `${endpoint}/:clubProfileId/timelineEvent`,
  async (req, res, next) => {
    try {
      const { clubProfileId } = req.params;

      const clubProfile = await prisma.clubProfile.findUniqueOrThrow({
        where: {
          id: clubProfileId,
        },
        include: {
          club: true,
        },
      });

      if (!userIsClubMemberOrOwner(req.user, clubProfile.club.id)) {
        throw new ApiError(401, 'Cannot access object you dont own');
      }

      const { name, description, time, location, link } = req.body;
      const newTimelineEvent = await prisma.timelineEvent.create({
        data: {
          clubProfileId,
          name,
          description,
          time,
          location,
          link,
        },
      });
      return res.status(201).json({ data: newTimelineEvent });
    } catch (err) {
      next(err);
    }
  },
);

//Update a club's description or app cycle
router.put(`${endpoint}/:clubProfileId`, async (req, res, next) => {
  try {
    const { clubProfileId } = req.params;
    const { description, applicationCycleDescription } = req.body;
    const updatedClubProfileInfo = await prisma.clubProfile.update({
      where: { id: clubProfileId },
      data: {
        description,
        applicationCycleDescription,
      },
    });
    res.status(200).json({
      message: 'Updated club contact info',
      data: updatedClubProfileInfo,
    });
  } catch (err) {
    next(err);
  }
});

//Update contact info for a club profile
router.put(`${endpoint}/:clubProfileId/contactInfo`, async (req, res, next) => {
  try {
    const { clubProfileId } = req.params;

    const clubProfile = await prisma.clubProfile.findUniqueOrThrow({
      where: { id: clubProfileId },
      include: {
        club: true,
      },
    });

    if (!userIsClubMemberOrOwner(req.user, clubProfile.club.id)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const { name, email, phoneNumber, role } = req.body;
    const updatedClubContactInfo = await prisma.clubContactInfo.update({
      where: { clubProfileId },
      data: {
        name,
        email,
        phoneNumber,
        role,
      },
    });
    res.status(200).json({
      message: 'Updated club contact info',
      data: updatedClubContactInfo,
    });
  } catch (err) {
    next(err);
  }
});

//Update a social media for a club profile
router.put(`${endpoint}/socialMedia/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { url } = req.body;

    const socialMedia = await prisma.socialMedia.findUniqueOrThrow({
      where: { id },
      include: {
        clubProfile: {
          include: {
            club: true,
          },
        },
      },
    });

    if (!userIsClubMemberOrOwner(req.user, socialMedia.clubProfile.club.id)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const updatedSocialMedia = await prisma.socialMedia.update({
      where: { id },
      data: {
        url,
      },
    });
    res.status(200).json({
      message: 'Updated social media',
      data: updatedSocialMedia,
    });
  } catch (err) {
    next(err);
  }
});

//Update a timeline event for a club profile
router.put(`${endpoint}/timelineEvent/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, time, location, link } = req.body;

    const timelineEvent = await prisma.timelineEvent.findUniqueOrThrow({
      where: { id },
      include: {
        clubProfile: {
          include: {
            club: true,
          },
        },
      },
    });

    if (!userIsClubMemberOrOwner(req.user, timelineEvent.clubProfile.club.id)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const updatedTimelineEvent = await prisma.timelineEvent.update({
      where: { id },
      data: {
        name,
        description,
        time,
        location,
        link,
      },
    });

    res.status(200).json({
      message: 'Updated timeline event',
      data: updatedTimelineEvent,
    });
  } catch (err) {
    next(err);
  }
});

//Delete a social media for a club profile
router.delete(`${endpoint}/socialMedia/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;

    const socialMedia = await prisma.socialMedia.findUniqueOrThrow({
      where: { id },
      include: {
        clubProfile: {
          include: {
            club: true,
          },
        },
      },
    });

    if (!userIsClubMemberOrOwner(req.user, socialMedia.clubProfile.club.id)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const deletedSocialMedia = await prisma.socialMedia.delete({
      where: { id },
    });
    res.status(200).json({
      message: 'Deleted social media',
      data: deletedSocialMedia,
    });
  } catch (err) {
    next(err);
  }
});

router.delete(`${endpoint}/timelineEvent/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;

    const timelineEvent = await prisma.timelineEvent.findUniqueOrThrow({
      where: { id },
      include: {
        clubProfile: {
          include: {
            club: true,
          },
        },
      },
    });

    if (!userIsClubMemberOrOwner(req.user, timelineEvent.clubProfile.club.id)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const deletedTimelineEvent = await prisma.timelineEvent.delete({
      where: { id },
    });
    res.status(200).json({
      message: 'Deleted timeline event',
      data: deletedTimelineEvent,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
