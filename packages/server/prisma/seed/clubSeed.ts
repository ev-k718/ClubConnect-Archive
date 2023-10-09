// Seeding functions related to a club and its members
import { faker } from '@faker-js/faker';
import { SocialMediaType } from '@prisma/client';

import prisma from '../client';
import { getSome } from '../helper';

/**
 * Generates a fake club
 */
export const generateClub = async (testing: boolean) => {
  const name = faker.lorem.words(3);
  const newClub = await prisma.club.create({
    data: {
      name: 'club ' + name,
    },
  });
  if (!testing) {
    const clubProfile = await generateClubProfile(newClub.id);
    await generateClubContactInfo(clubProfile.id);
    await generateSocialMedia(clubProfile.id, 'INSTAGRAM');
    await generateSocialMedia(clubProfile.id, 'FACEBOOK');

    const numEvents = faker.datatype.number({ min: 1, max: 5 });
    for (let i = 0; i < numEvents; i++) {
      await generateTimelineEvent(clubProfile.id);
    }
  }
  return newClub;
};

/**
 * Generates a random amount of members, from the existing users
 * @param clubId: the club we are filling
 */
export const generateMembers = async (clubId: string) => {
  //get the users in the DB
  const users = await prisma.user.findMany();
  const numMembers = faker.datatype.number({ min: 3, max: users.length });
  //select some users to become members
  const members = getSome(users, numMembers);

  for (const member of members) {
    await prisma.clubMember.create({
      data: {
        userId: member.id,
        clubId,
      },
    });
  }

  const owners = getSome(members, 3);

  await prisma.club.update({
    where: { id: clubId },
    data: {
      owners: {
        connect: owners.map((owner) => ({ id: owner.id })),
      },
    },
  });
};

export const generateClubContactInfo = async (clubProfileId: string) => {
  const name = faker.name.fullName();
  const email = faker.internet.email();
  const role = faker.name.jobTitle();
  const phoneNumber = faker.phone.number();

  return prisma.clubContactInfo.create({
    data: {
      clubProfileId,
      name,
      email,
      phoneNumber,
      role,
    },
  });
};

export const generateClubProfile = async (clubId: string) => {
  const description = faker.lorem.paragraphs(3);
  const applicationCycleDescription = `${faker.date.future().toDateString()}`;
  const clubSizeDescription = `Club size: ${faker.datatype.number(100)}`;

  return prisma.clubProfile.create({
    data: {
      clubId,
      description,
      applicationCycleDescription,
      clubSizeDescription,
    },
  });
};

/**
 * will create a social media for a club profile
 * @param clubProfileId the club profile we are adding social media to
 * @param type the type of social media we are adding
 */
export const generateSocialMedia = async (
  clubProfileId: string,
  type: SocialMediaType,
) => {
  const url = faker.internet.url();
  const newSocialMedia = await prisma.socialMedia.create({
    data: {
      clubProfileId,
      type,
      url,
    },
  });
  return newSocialMedia;
};

export const generateTimelineEvent = async (clubProfileId: string) => {
  const name = faker.lorem.words(3);
  const description = faker.lorem.paragraphs(3);
  const time = faker.date.future();
  const location = faker.address.city();

  return prisma.timelineEvent.create({
    data: {
      clubProfileId,
      name,
      description,
      time,
      location,
    },
  });
};

export const deleteSocialMedia = prisma.socialMedia.deleteMany();
export const deleteClubContactInfo = prisma.clubContactInfo.deleteMany();
export const deleteClubProfiles = prisma.clubProfile.deleteMany();
export const deleteClubMembers = prisma.clubMember.deleteMany();
export const deleteClubs = prisma.club.deleteMany();
