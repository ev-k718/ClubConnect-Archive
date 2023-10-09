// @ts-nocheck
import ApplicationBox from '@/components/clubProfile/applicationBox';
import EventView from '@/components/clubProfile/eventView';
import SocialMediaView from '@/components/clubProfile/socialMediaView';
import useAuth from '@/hooks/useAuth';
import UserLayout from '@/layouts/userLayout';
import {
  Divider,
  Flex,
  Group,
  Paper,
  Text,
  Title,
  useMantineTheme,
  LoadingOverlay
} from '@mantine/core';
// TODO: make a fetch with ID to get the club object from DB
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import Router from 'next/router';
import { ReactElement } from 'react';
import { Application, SocialMedia, TimelineEvent } from 'types/dbTypes';
import { NextPageWithLayout } from 'types/layout';

const mapEvents = (timelineEvents: TimelineEvent[]) => {
  if (timelineEvents.length === 0) {
    return (
      <Text size="xl" color="gray" fw={'bold'} italic align="center">
        No events yet!
      </Text>
    );
  }

  return timelineEvents.map((event: TimelineEvent) => {
    return (
      <EventView event={event} editable={false} key={`${event.id}-event`} />
    );
  });
};

const mapApplications = (applications: Application[]) => {
  if (applications.length === 0) {
    return (
      <Text size="l" color="gray" fw={'bold'} italic>
        We are not currently recruiting. Check back later!
      </Text>
    );
  }

  return applications.map((application: Application[]) => {
    return (
      <ApplicationBox
        application={application}
        key={`${application.id}-applications`}
      />
    );
  });
};

const mapSocialMedias = (socialMedias: SocialMedia[]) =>
  socialMedias.map((socialMedia: SocialMedia) => {
    return (
      <SocialMediaView media={socialMedia} key={`${socialMedia.id}-social`} />
    );
  });

const ClubProfile: NextPageWithLayout = () => {
  const theme = useMantineTheme();
  const { clubId } = Router.query;
  const { getAccessToken: getAccessToken } = useAuth();
  const { data: token } = getAccessToken();

  //'club' is the unique query key (used for caching under the hood)

  const queries = useQueries({
    queries: [
      {
        queryKey: ['getClubInfoForApplicant', clubId],
        queryFn: async () => {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/club/${clubId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          return res.data.data;
        },
        enabled: !!token,
      },
      {
        queryKey: ['getLiveClubApplicationsForApplicants', clubId],
        queryFn: async () => {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/application/getLiveClubApplications/${clubId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          return res.data.data;
        },
        enabled: !!token,
      },
    ],
  });

  const clubInfoQuery = queries[0];
  const liveClubApplicationsQuery = queries[1];

  if (clubInfoQuery.isLoading || liveClubApplicationsQuery.isLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />;
  }

  if (liveClubApplicationsQuery.isError || clubInfoQuery.isError) {
    return <>Error</>;
  }

  const { clubProfile, name } = clubInfoQuery.data;
  const validApplications = liveClubApplicationsQuery.data;
  return (
    <>
      <Flex
        bg="black"
        h="25vh"
        w="100%"
        mb={20}
        justify="center"
        align="center"
      >
        <Flex bg="white" py={20} px={20} miw={250} justify="center">
          <Title order={1} fw="bold">
            {name}
          </Title>
        </Flex>
      </Flex>

      <Flex direction="row" w="100%" px={40} gap={10} mb={20}>
        <Flex direction="column" w="60%" rowGap={10}>
          <Paper p="md">
            <Title order={4} c="gray.9" pb={10}>
              About Us
            </Title>
            <Text c="gray.7">{clubProfile.description} </Text>
          </Paper>

          <Paper p="md">
            <Title order={4} c="gray.9">
              Events
            </Title>

            {mapEvents(clubProfile.timelineEvents)}
          </Paper>
        </Flex>

        <Divider orientation="vertical" color={theme.other.custom_black} />

        <Flex direction="column" w="40%" rowGap={10}>
          <Paper p="md">
            <Title order={4} fw="bold">
              Open Applications:
            </Title>
          </Paper>

          <Flex
            gap="xl"
            justify="center"
            align="center"
            direction="row"
            wrap="wrap"
          >
            {mapApplications(validApplications)}
          </Flex>
          <Flex>
            {clubProfile.contactInfo && (
              <Flex direction="row" w="40%">
                <Paper p="md">
                  <Title order={4} fw="bold">
                    Contact Us:
                  </Title>
                  <Text c="gray.7">
                    {clubProfile.contactInfo
                      ? clubProfile.contactInfo.name
                      : name}
                  </Text>
                  <Text c="gray.7">
                    {clubProfile.contactInfo
                      ? clubProfile.contactInfo.email
                      : 'no club email found'}
                  </Text>
                  <Text c="gray.7">
                    {clubProfile.contactInfo
                      ? clubProfile.contactInfo.phoneNumber
                      : 'no club number found'}
                  </Text>
                  <Group spacing="xs">
                    {mapSocialMedias(clubProfile.socialMedia)}
                  </Group>
                </Paper>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

ClubProfile.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};
export default ClubProfile;
