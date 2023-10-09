import type { ApplicationSubmission, Club, ClubMember, User } from '@prisma/client';
type extendedUser = User & {clubsOwned: Club[], clubMemberships: ClubMember[], applicationSubmissions: ApplicationSubmission[]}
declare global {
  namespace Express {
    interface Request {
      user: extendedUser;
    }
  }
}
