import { z } from 'zod';

export const answerValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  applicationSubmissionId: z.string().regex(/^\d+$/).optional(),
  questionId: z.string().regex(/^\d+$/).optional(),
  value: z.string().optional(),
});

export const applicationSubmissionValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  applicantId: z.string().regex(/^\d+$/).optional(),
  applicationId: z.string().regex(/^\d+$/).optional(),
  status: z
    .union([z.literal('DRAFT'), z.literal('LIVE'), z.literal('CLOSED')])
    .optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const applicationValidator = z.object({
  //theyre all optional here since depending on the endpoint, some of these fields may not be needed
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  clubId: z.string().regex(/^\d+$/).optional(), //clubId still a string, regex checks its a number
  status: z
    .union([z.literal('DRAFT'), z.literal('LIVE'), z.literal('CLOSED')])
    .optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  deadline: z.string().datetime().optional(),
  openDate: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const clubContactInfoValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  clubProfileId: z.string().regex(/^\d+$/).optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().regex(/^\d+$/).optional(), //assuming no + or - in phone number
});

export const clubMemberValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  userId: z.string().regex(/^\d+$/).optional(),
  clubId: z.string().regex(/^\d+$/).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const clubProfileValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  clubId: z.string().regex(/^\d+$/).optional(),
  description: z.string().optional(),
  timelineDescription: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const clubValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  name: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const commentValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  applicationSubmissionId: z.string().regex(/^\d+$/).optional(),
  memberId: z.string().regex(/^\d+$/).optional(),
  value: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const questionValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  applicationId: z.string().regex(/^\d+$/).optional(),
  value: z.string().optional(),
});

export const scoreValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  submissionId: z.string().regex(/^\d+$/).optional(),
  scoringCriteriaId: z.string().regex(/^\d+$/).optional(),
  score: z
    .string()
    .regex(/^\d+$/)
    .refine((score) =>
      parseInt(score) > 0 && parseInt(score) < 11 ? true : false,
    )
    .optional(), //assuming range of score is 1 to 10
  memberId: z.string().regex(/^\d+$/).optional(),
});

export const scoringCriteriaValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  applicationId: z.string().regex(/^\d+$/).optional(),
  description: z.string().optional(),
});

export const socialMediaValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  clubProfileId: z.string().regex(/^\d+$/).optional(),
  url: z.string().url().optional(),
});

export const timelineEventValidator = z.object({
  id: z.string().regex(/^\d+$/).optional(), //id still a string, regex checks its a number
  clubProfileId: z.string().regex(/^\d+$/).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  time: z.string().datetime().optional(),
  location: z.string().optional(),
  link: z.string().url().optional(),
});
