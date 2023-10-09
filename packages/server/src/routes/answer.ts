// Answer API for CRUD operations on answers
//TODO: TEST ALL THESE ROUTES AND MAKE SURE THEY WORK
// NOTE: THEY ARE NOT BEING USED ANYWHERE YET
import { ApplicationStatus } from '@prisma/client';
import { Router, application } from 'express';

import ApiError from '../../model/ApiError';
import prisma from '../../prisma/client';

const router = Router();
const endpoint = '/answer';

// Get an answer by ID
router.get(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    //TODO: Make sure only members of the club or owners of the submission can get answers

    const answer = await prisma.answer.findFirstOrThrow({
      where: {
        id: id,
      },
    });

    const applicationSubmission =
      await prisma.applicationSubmission.findFirstOrThrow({
        where: {
          id: answer.applicationSubmissionId,
        },
        select: {
          application: {
            select: {
              club: true,
            },
          },
        },
      });

    // const club = await prisma.club.findFirstOrThrow({
    //   where: {
    //     id: applicationSubmission.application.clubId,
    //   },
    //   include: {
    //     owners: true,
    //   },
    // });
    console.log(req.user);

    if (
      answer.userId !== userId ||
      !req.user.clubsOwned.some(
        (club) => club.id === applicationSubmission.application.club.id,
      ) ||
      !req.user.clubMemberships.some(
        (club) => club.id === applicationSubmission.application.club.id,
      )
    ) {
      // console.log(userId)
      // console.log(answer.userId)
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    res.status(200).json({
      message: 'Answer with given id found',
      data: answer,
    });
  } catch (err) {
    next(err);
  }
});

// Create a new answer
router.post(`${endpoint}`, async (req, res, next) => {
  try {
    const { applicationSubmissionId, questionId, value } = req.body;
    const { id: userId } = req.user;
    //TODO: Make sure only owners of the submission can create answers
    const applicationSubmission =
      await prisma.applicationSubmission.findFirstOrThrow({
        where: {
          id: applicationSubmissionId,
        },
      });

    if (applicationSubmission.applicantId !== userId) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const newAnswer = await prisma.answer.create({
      data: {
        userId,
        applicationSubmissionId,
        questionId,
        value,
      },
    });
    res.status(201).json({ message: 'Answer created', data: newAnswer });
  } catch (err) {
    next(err);
  }
});

// Update an existing answer
router.put(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const { id: userId } = req.user;
    // TODO: Make sure only owners of the submission can update answers
    const submission = await prisma.applicationSubmission.findFirstOrThrow({
      where: {
        id: id,
      },
    });

    if (submission.applicantId !== userId) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const updatedAnswer = await prisma.answer.update({
      where: { id: id },
      data: {
        value,
      },
    });
    res.status(200).json({ message: 'Updated answer', data: updatedAnswer });
  } catch (err) {
    next(err);
  }
});

// Delete an existing answer
router.delete(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const answer = await prisma.answer.delete({
      where: { id: id },
    });
    const { id: userId } = req.user;
    //TODO: Make sure only owners of the submission can delete answers
    const submission = await prisma.applicationSubmission.findFirstOrThrow({
      where: {
        id: id,
      },
    });

    if (submission.applicantId !== userId) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    res.status(200).json({ message: 'Deleted answer', data: { answer } });
  } catch (err) {
    next(err);
  }
});

export default router;
