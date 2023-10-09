//@ts-nocheck
// Applicant API for CRUD Ops
import { Router } from 'express';

import ApiError from '../../model/ApiError';
import prisma from '../../prisma/client';
import {
  userIsClubMemberOrOwner,
  userIsClubOwner,
} from '../middleware/checkOwner';

const router = Router();
const endpoint = '/applicationSubmission';

// Get an application submission given its id (applicant only)
router.get(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    //TODO: Make sure only owner of the application can get an application

    const applicationSubmission =
      await prisma.applicationSubmission.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          answers: true,
          scores: true,
          comments: true,
          application: {
            include: {
              questions: {
                orderBy: {
                  index: 'asc',
                },
              }
            },
          },
        },
      });

    if (applicationSubmission.applicantId !== userId) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    return res.status(200).json({
      message: 'Getting application submission',
      data: applicationSubmission,
    });
  } catch (err) {
    next(err);
  }
});

// Get all application submissions for a given applicant(applicant only)
router.get(`${endpoint}`, async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    //TODO: Make sure only owner of the submission can get an submission

    const applicationSubmissions = await prisma.applicationSubmission.findMany({
      where: {
        applicantId: userId,
      },
      include: {
        answers: true,
        application: {
          include: {
            club: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        application: {
          deadline: 'asc',
        },
      },
    });

    return res.status(200).json({
      message: 'Getting application submission',
      data: applicationSubmissions,
    });
  } catch (err) {
    next(err);
  }
});

// Get all completed application submissions for a given application (main use case for members)
router.get(
  `${endpoint}/getCompletedSubmissionForApplication/:applicationId`,
  async (req, res, next) => {
    try {
      const { applicationId } = req.params;
      //TODO: Make sure only club members can get all the submissions for an application

      const application = await prisma.application.findUniqueOrThrow({
        where: {
          id: applicationId,
        },
        include: {
          club: true,
        },
      });

      if (!userIsClubMemberOrOwner(req.user, application.clubId)) {
        throw new ApiError(401, 'Cannot access object you dont own');
      }

      const applicationSubmissions =
        await prisma.applicationSubmission.findMany({
          where: {
            applicationId,
            status: 'SUBMITTED',
          },
          select: {
            id: true,
            applicantId: true,
            answers: true,
            scores: true,
            comments: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              },
            },
            applicant: {
              select: {
                name: true,
                email: true,
              }
            }
          },
        });
      
      return res.status(200).json({
        message: 'Getting application submission',
        data: applicationSubmissions,
      });
    } catch (err) {
      next(err);
    }
  },
);

// Creates a new applicationSubmission for a given application (main use case is for applicants)
router.post(`${endpoint}`, async (req, res, next) => {
  try {
    const { applicationId } = req.body;
    const { id: applicantId } = req.user;

    const applicationSubmission = await prisma.applicationSubmission.upsert({
      where: {
        applicantId_applicationId: {
          applicantId,
          applicationId,
        },
      },
      create: {
        applicantId,
        applicationId,
      },
      update: {},
    });

    return res.status(200).json({
      message: 'Application Submission returned/created',
      data: applicationSubmission,
    });
  } catch (err) {
    next(err);
  }
});

// Creates a new score for a given applicationSubmission (main use case is for members)
//TODO: Write tests for this
router.post(
  `${endpoint}/:applicationSubmissionId/score`,
  async (req, res, next) => {
    try {
      const { applicationSubmissionId } = req.params;
      const { scoringCriteriaId, score } = req.body;
      const { id: userId } = req.user;
      //TODO: make sure only the members of the club can create a score
      const applicationSubmission =
        await prisma.applicationSubmission.findUniqueOrThrow({
          where: {
            id: applicationSubmissionId,
          },
          include: {
            application: {
              include: {
                club: true,
              },
            },
          },
        });

      if (
        !(userIsClubMemberOrOwner(
          req.user,
          applicationSubmission.application.club.id,
        ))
      ) {
        throw new ApiError(401, 'Cannot access object you dont own');
      }
      const newScore = await prisma.score.create({
        data: {
          userId: userId,
          scoringCriteriaId: scoringCriteriaId,
          applicationSubmissionId: applicationSubmissionId,
          score:score,
        },
      });
      return res.status(201).json({
        message: 'Score created',
        data: newScore,
      });
    } catch (err) {
      next(err);
    }
  },
);

// Creates a new comment for a given applicationSubmission (main use case is for members)
//TODO: Write tests for this
router.post(
  `${endpoint}/:applicationSubmissionId/comment`,
  async (req, res, next) => {
    try {
      const { applicationSubmissionId } = req.params;
      const { value } = req.body;
      const { id: userId } = req.user;
      //TODO: make sure only the members of the club can create a comment

      const applicationSubmission =
        await prisma.applicationSubmission.findUniqueOrThrow({
          where: {
            id: applicationSubmissionId,
          },
          include: {
            application: {
              include: {
                club: true,
              },
            },
          },
        });

      if (
        !(await userIsClubMemberOrOwner(
          req.user,
          applicationSubmission.application.club.id,
        ))
      ) {
        throw new ApiError(401, 'Cannot access object you dont own');
      }

      const newComment = await prisma.comment.create({
        data: {
          userId,
          applicationSubmissionId,
          value,
        },
      });
      return res.status(201).json({
        message: 'Comment created',
        data: newComment,
      });
    } catch (err) {
      next(err);
    }
  },
);

// Upserts new answers for a given applicationSubmission (main use case is for applicants)
//TODO: Write tests for this
router.post(
  `${endpoint}/:applicationSubmissionId/answers`,
  async (req, res, next) => {
    try {
      const { applicationSubmissionId } = req.params;
      const { answers } = req.body;
      const { id: userId } = req.user;

      // Map the input array to an array of promises for upserting answers
      const upsertAnswerPromises = answers.map((answer: any) =>
        prisma.answer.upsert({
          // Checks if the answer already exists
          where: {
            applicationSubmissionId_questionId: {
              applicationSubmissionId,
              questionId: answer.questionId,
            },
          },

          // If the answer exists, update it
          update: {
            value: answer.value,
          },

          // If the answer doesn't exist, create it
          create: {
            ...answer,
            userId,
            applicationSubmissionId,
          },
        }),
      );

      // Execute all upsert operations in a single transaction
      const upsertedAnswers = await prisma.$transaction(upsertAnswerPromises);

      return res.status(201).json({
        message: 'Answers upserted',
        data: upsertedAnswers,
      });
    } catch (err) {
      next(err);
    }
  },
);

// Submit an application submission (main use case for applicants)
router.put(
  `${endpoint}/submitApplicationSubmission/:id`,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;

      //Will only update one record or none as one of the parameters is the unique id of the submission
      const app = await prisma.applicationSubmission.findFirstOrThrow({
        where: {
          id,
          status: 'DRAFT',
        },
        include: {
          applicant: true,
        },
      });

      if (userId !== app.applicant.id) {
        throw new ApiError(401, 'Cannot access object you dont own');
      }

      const applicationSubmission = await prisma.applicationSubmission.update({
        where: {
          id,
        },
        data: {
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      });

      return res.status(200).json({
        message: 'Application Submission submitted',
        data: applicationSubmission,
      });
    } catch (err) {
      next(err);
    }
  },
);

//Update a commment on an application submission (main use case for members)
//TODO: test this
router.put(`${endpoint}/comment/:commentId`, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { value } = req.body;
    const { id: userId } = req.user;

    //TODO: Make sure only owner of the comment can update an comment
    const commentUser = await prisma.comment.findUniqueOrThrow({
      where: {
        id: commentId,
      },
      select: {
        user: true,
      },
    });

    if (userId !== commentUser.user.id) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const comment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        value,
      },
    });

    return res.status(200).json({
      message: 'Comment updated',
      data: comment,
    });
  } catch (err) {
    next(err);
  }
});

//Update a score on an application submission (main use case for members)
//TODO: test this
router.put(`${endpoint}/score/:scoreId`, async (req, res, next) => {
  try {
    const { scoreId } = req.params;
    const { score } = req.body;
    const { id: userId } = req.user;
    //TODO: make sure only the owner of the score can update a score
    const scoreUser = await prisma.score.findUniqueOrThrow({
      where: {
        id: scoreId,
      },
      select: {
        user: true,
      },
    });

    if (userId !== scoreUser.user.id) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }
    const updatedScore = await prisma.score.update({
      where: {
        id: scoreId,
      },
      data: {
        score,
      },
    });

    return res.status(200).json({
      message: 'Score updated',
      data: updatedScore,
    });
  } catch (err) {
    next(err);
  }
});

// Deletes a submission given an id
router.delete(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    //TODO: Make sure only owner of the submission can delete an submission

    const applicationSubmissionUser =
      await prisma.applicationSubmission.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          applicant: true,
        },
      });

    if (req.user.id !== applicationSubmissionUser.applicant.id) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const applicationSubmission = await prisma.applicationSubmission.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: 'Deleted Application submission',
      data: applicationSubmission,
    });
  } catch (err) {
    next(err);
  }
});

//TODO: test this
router.delete(`${endpoint}/comment/:commentId`, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { id: userId } = req.user;
    //TODO: Make sure only owner of the comment can delete an comment
    const commentUser = await prisma.comment.findUniqueOrThrow({
      where: {
        id: commentId,
      },
      select: {
        user: true,
      },
    });

    if (userId !== commentUser.user.id) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return res.status(200).json({
      message: 'Deleted comment',
      data: comment,
    });
  } catch (err) {
    next(err);
  }
});

router.delete(`${endpoint}/score/:scoreId`, async (req, res, next) => {
  try {
    const { scoreId } = req.params;
    const { id: userId } = req.user;
    //TODO: make sure only the owner of the score can delete a score
    const scoreUser = await prisma.score.findUniqueOrThrow({
      where: {
        id: scoreId,
      },
      select: {
        user: true,
      },
    });

    if (userId !== scoreUser.user.id) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const score = await prisma.score.delete({
      where: {
        id: scoreId,
      },
    });

    return res.status(200).json({
      message: 'Deleted score',
      data: score,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
