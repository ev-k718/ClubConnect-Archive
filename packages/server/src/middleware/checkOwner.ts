import { extendedUser } from 'types/express';

import prisma from '../../prisma/client';

//make a function that takes a clubID and a userId and checks if the user is the owner of the club
export async function userIsClubOwner(user: extendedUser, clubId: string) {
  // const club = await prisma.club.findFirstOrThrow({
  //     where: {
  //         id: clubId,
  //     },
  //     include: {
  //         owners: true,
  //     },
  // });
  return user.clubsOwned.some((club) => club.id === clubId);
}

export function userIsClubMemberOrOwner(user: extendedUser, clubId: string) {
  return (
    user.clubsOwned.some((club) => club.id === clubId) ||
    user.clubMemberships.some(
      (clubMembership) => clubMembership.clubId === clubId,
    )
  );
}
