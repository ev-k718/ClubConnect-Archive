import { type } from 'os';

type UserRole = 'USER' | 'SUPERUSER';

export type User = {
  id: string;
  auth0_Id: string;
  role: UserRole;
  clubMemberships?: any;
  clubsOwned?: any;
  applicationSubmissions?: any;
  commentsMade?: any;
  createdAt?: string;
  updatedAt?: string;
  answers?: any;
  scoresGiven?: any;
  name?: strin;
  email?: string;
};

export type TimelineEvent = {
  id: string;
  clubProfileId?: string;
  name: string;
  description: string;
  time: Date;
  location: string;
  link?: string;
};

export type ClubProfile = {
  id: string;
  clubId?: string;
  description: string;
  contactInfo: any;
  socialMedia: any;
  timelineEvents: TimelineEvent[];
  applicationCycleDescription: string;
  clubSizeDescription: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Application = {
  clubId: string;
  deadline: string;
  id: string;
  name: string;
  openDate: string;
  status: string;
  description: string;
  questions: Question[];
};

export type ClubContactInfo = {
  id: string;
  clubProfileId?: string;
  name: string;
  role: string;
  email: string;
  phoneNumber?: string;
};

export type SocialMedia = {
  id: string;
  clubProfileId?: string;
  type: string;
  url: string;
};

export type ClubMembership = {
  id: string;
  user: User;
  userId: string;
  club?: any;
  clubId: string;
  createdAt: string;
  updatedAt: string;
};

export type Question = {
  id: string;
  applicationId?: string;
  value: string;
  answers?: any[];
  isRequired: boolean;
  type: 'TEXT_IN' | 'FILE_UPLOAD' | string;
  index?: number;
};
