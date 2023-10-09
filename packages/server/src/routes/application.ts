// //application API for CRUD ops
import { Application, Question, ScoringCriteria } from '@prisma/client';
import { Router } from 'express';

import ApiError from '../../model/ApiError';
import prisma from '../../prisma/client';
import {
  userIsClubMemberOrOwner,
  userIsClubOwner,
} from '../middleware/checkOwner';

const router = Router();
const endpoint = '/application';

// Gets an application given its id
router.get(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const application = await prisma.application.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        questions: true,
        scoringCriteria: true,
        submissions: true,
      },
    });

    //TODO: All people should be able to get an application however only the members of the club should be able to see the submissions and scoring criteria
    //TODO: Make a check user is a member of the club and if not then remove the submissions and scoring criteria from the response
    //ie:
    // if(!userIsMemberOfClub) {
    //   delete application.submissions
    //   delete application.scoringCriteria
    // }

    const club = await prisma.club.findFirstOrThrow({
      where: {
        id: application.clubId,
      },
      include: {
        owners: true,
        members: true,
      },
    });

    let returnApplication;
    if (
      userIsClubMemberOrOwner(req.user, application.clubId)
    ) {
      returnApplication = await prisma.application.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          scoringCriteria: true,
          submissions: true,
          questions: {
            orderBy: {
              index: 'asc',
            },
          }
        },
      });
    } else {
      returnApplication = await prisma.application.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          questions: {
            orderBy: {
              index: 'asc',
            },
          }
        },
      });
    }
    //order returnApplication.questions by order
    //doing it this way cause you cant orderBy with relations currently
    // returnApplication.questions = returnApplication.questions.sort(
    //   (a, b) => a.index - b.index,
    // );
    return res.status(200).json({
      message: 'Found application with given id',
      data: returnApplication,
    });
  } catch (err) {
    next(err);
  }
});

// Gets all the an application for a given club
router.get(
  `${endpoint}/getApplicationsForClub/:clubId`,
  async (req, res, next) => {
    try {
      const { clubId } = req.params;
      const { id: userId } = req.user;

      const application = await prisma.application.findMany({
        where: {
          clubId,
        },
        include: {
          questions: true,
          scoringCriteria: true,
          submissions: true,
        },
      });

      //TODO: All people should be able to get an application however only the members of the club should be able to see the submissions and scoring criteria
      //TODO: Make a check user is a member of the club and if not then remove the submissions and scoring criteria from the response
      //ie:
      // if(!userIsMemberOfClub){
      //   delete application.submissions
      //   delete application.scoringCriteria
      // }

      const club = await prisma.club.findFirstOrThrow({
        where: {
          id: clubId,
        },
        include: {
          owners: true,
          members: true,
        },
      });

      let returnApplication;
      if (
        club.members.some((member) => member.id === userId) ||
        club.owners.some((owner) => owner.id === userId)
      ) {
        returnApplication = await prisma.application.findMany({
          where: {
            clubId,
          },
          include: {
            questions: true,
            scoringCriteria: true,
            submissions: true,
          },
        });
      } else {
        returnApplication = await prisma.application.findMany({
          where: {
            clubId,
          },
          include: {
            questions: true,
          },
        });
      }

      return res
        .status(200)
        .json({ message: 'Application retrieved', data: returnApplication });
    } catch (err) {
      next(err);
    }
  },
);

//get live applications for a club
router.get(
  `${endpoint}/getLiveClubApplications/:clubId`,
  async (req, res, next) => {
    try {
      const { clubId } = req.params;
      const date = new Date();

      const applications = await prisma.application.findMany({
        where: {
          clubId,
          status: 'LIVE',
        },
        orderBy: {
          deadline: 'asc',
        },
        include: {
          questions: {
            orderBy: {
              index: 'asc',
            },
          }
        },

      });

      console.log(applications);

      let validApplications: Application[] = [];

      for (const application of applications) {
        if (application.deadline < date) {
          await prisma.application.update({
            where: {
              id: application.id,
            },
            data: {
              status: 'CLOSED',
            },
          });
        } else {
          validApplications.push(application);
        }
      }

      console.log(validApplications);

      res.status(200).json({
        message: 'Live Applications retrieved',
        data: validApplications,
      });
    } catch (err) {
      next(err);
    }
  },
);
// creates a new application for a club
router.post(`${endpoint}`, async (req, res, next) => {
  try {
    const { clubId, name, description, deadline, openDate, questions, status, scoringCriteria} =
      req.body.data;
    //TODO: Make sure only members of the club can create an application

    const club = await prisma.club.findFirstOrThrow({
      where: {
        id: clubId,
      },
      include: {
        owners: true,
      },
    });

    if (!userIsClubOwner(req.user, clubId)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const application = await prisma.application.create({
      data: {
        clubId,
        name,
        description,
        deadline,
        openDate,
        status,
      },
    });
    let i = 0;
    questions.forEach(async (question: Question) => {
      await prisma.question.create({
        data: {
          applicationId: application.id,
          value: question.value,
          isRequired: question.isRequired,
          type: question.type,
          index: i++,
        },
      });
    });

    scoringCriteria.forEach(async (scoringCriteria: ScoringCriteria) => {
      await prisma.scoringCriteria.create({
        data: {
          applicationId: application.id,
          description: scoringCriteria.description,
        },
      });
    });

    res.status(201).json({ message: 'Application created', data: application });
  } catch (err) {
    next(err);
  }
});

//Creates a new question for an application
// router.post(`${endpoint}/:applicationId/question`, async (req, res, next) => {
//   try {
//     const { applicationId } = req.params;
//     const { value, questions } = req.body;
//     const { id: userId } = req.user;

//     //TODO: make sure only the members of the club can create a question

//     const application = await prisma.application.findFirstOrThrow({
//       where: {
//         id: applicationId,
//       },
//       include: {
//         club: true,
//       },
//     });

//     if (!userIsClubOwner(req.user, application.clubId)) {
//       throw new ApiError(401, 'Cannot access object you dont own');
//     }
//     //TODO: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#nested-writes for questions
//     const question = await prisma.question.create({
//       data: {
//         applicationId,
//         value,
//       },
//     });

//     res.status(201).json({ message: 'Question created', data: question });
//   } catch (err) {
//     next(err);
//   }
// });

//Creates a new scoring criteria for an application
router.post(
  `${endpoint}/:applicationId/scoringCriteria`,
  async (req, res, next) => {
    try {
      const { applicationId } = req.params;
      const { description } = req.body;
      const { id: userId } = req.user;

      //TODO: make sure only the members of the club can create a scoring criteria

      const application = await prisma.application.findFirstOrThrow({
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
      const scoringCriteria = await prisma.scoringCriteria.create({
        data: {
          applicationId,
          description,
        },
      });
      res
        .status(201)
        .json({ message: 'Scoring Criteria created', data: scoringCriteria });
    } catch (err) {
      next(err);
    }
  },
);

// updates an application given its id
router.put(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const { name, description, deadline, openDate, questions, status, scoringCriteria } = req.body.data;
    //TODO: Make sure only members of the club can update an application

    const application = await prisma.application.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        club: true,
      },
    });
    console.log(scoringCriteria)

    const club = await prisma.club.findFirstOrThrow({
      where: {
        id: application.clubId,
      },
      include: {
        owners: true,
        members: true,
      },
    });

    if (!userIsClubMemberOrOwner(req.user, application.clubId)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const update = await prisma.application.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        deadline,
        openDate,
        status,
      },
    });

    await prisma.scoringCriteria.deleteMany({
      where: {
        id: {
          notIn: scoringCriteria.map((scoringCriteria: ScoringCriteria) => scoringCriteria.id),
        },
        applicationId: id,
      },
    });

    scoringCriteria.forEach(async (scoringCriteria: ScoringCriteria) => {
      await prisma.scoringCriteria.upsert({
        create: {
          description: scoringCriteria.description,
          applicationId: id,
        },
        where: {
          id: scoringCriteria.id || '',
        },
        update: {
          description: scoringCriteria.description,
        },
      });
    });

    //delete questions that are not in the new array
    await prisma.question.deleteMany({
      where: {
        id: {
          notIn: questions.map((question: Question) => question.id),
        },
        applicationId: id,
      },
    });
    let i = 0;
    questions.forEach(async (question: Question) => {
      await prisma.question.upsert({
        create: {
          value: question.value,
          applicationId: id,
          isRequired: question.isRequired,
          type: question.type,
          index: i++,
        },
        where: {
          id: question.id || '',
        },
        update: {
          value: question.value,
          isRequired: question.isRequired,
          type: question.type,
          index: i++,
        },
      });
    });

    //TODO: iterate over the array of questions make sure they have unique indexes, throw an ApiError otherwise
    //then do an updateMany on questions
    return res
      .status(200)
      .json({ message: 'Application Updated', data: update });
  } catch (err) {
    next(err);
  }
});

// updates an question given its id
router.put(`${endpoint}/question/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const { id: userId } = req.user;
    //TODO: Make sure only members of the club can update a question

    const application = await prisma.application.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        club: true,
      },
    });

    if (!userIsClubMemberOrOwner(req.user, application.clubId)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const update = await prisma.question.update({
      where: {
        id,
      },
      data: {
        value,
      },
    });
    return res.status(200).json({ message: 'Question Updated', data: update });
  } catch (err) {
    next(err);
  }
});

// updates an scoring criteria given its id
router.put(`${endpoint}/scoringCriteria/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const { id: userId } = req.user;

    //TODO: Make sure only members of the club can update a scoring criteria

    const application = await prisma.application.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        club: true,
      },
    });

    if (!userIsClubMemberOrOwner(req.user, application.clubId)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const update = await prisma.scoringCriteria.update({
      where: {
        id,
      },
      data: {
        description,
      },
    });
    return res
      .status(200)
      .json({ message: 'Scoring Criteria Updated', data: update });
  } catch (err) {
    next(err);
  }
});

// deletes an application with id
router.delete(`${endpoint}/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    // TODO: Make sure only members of the club can delete an application

    const application1 = await prisma.application.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        club: true,
      },
    });

    if (!userIsClubMemberOrOwner(req.user, application1.clubId)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const application = await prisma.application.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: 'Deleted Application', data: application });
  } catch (err) {
    next(err);
  }
});

// deletes an question with id
router.delete(`${endpoint}/question/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    //TODO: Make sure only members of the club can delete a question
    const application = await prisma.application.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        club: true,
      },
    });

    const club = await prisma.club.findFirstOrThrow({
      where: {
        id: application.clubId,
      },
      include: {
        owners: true,
        members: true,
      },
    });

    if (!userIsClubMemberOrOwner(req.user, application.clubId)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const question = await prisma.question.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ message: 'Deleted Question', data: question });
  } catch (err) {
    next(err);
  }
});

// deletes an scoring criteria with id
router.delete(`${endpoint}/scoringCriteria/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    //TODO: Make sure only members of the club can delete a scoring criteria

    const application = await prisma.application.findFirstOrThrow({
      where: {
        id: id,
      },
      include: {
        club: true,
      },
    });

    if (!userIsClubMemberOrOwner(req.user, application.clubId)) {
      throw new ApiError(401, 'Cannot access object you dont own');
    }

    const scoringCriteria = await prisma.scoringCriteria.delete({
      where: {
        id,
      },
    });
    res
      .status(200)
      .json({ message: 'Deleted Scoring Criteria', data: scoringCriteria });
  } catch (err) {
    next(err);
  }
});

export default router;
