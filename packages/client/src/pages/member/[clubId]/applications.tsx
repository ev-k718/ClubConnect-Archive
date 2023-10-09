import withValidateMembership from '@/HOC/withValidateMembership';
import ApplicationButtonMembersView from '@/components/applicationButtonMembersView';
import useAuth from '@/hooks/useAuth';
import AdminLayout from '@/layouts/adminLayout';
import { Button, Flex, Paper, Text, Title, LoadingOverlay } from '@mantine/core';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import React from 'react';
import type { ClubProfile } from 'types/dbTypes';
import { Application } from 'types/dbTypes';
import { NextPageWithLayout } from 'types/layout';

const ApplicationsMemberView: NextPageWithLayout = () => {
  const router = useRouter();
  const { clubId } = router.query;
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();

  const queries = useQueries({
    queries: [
      {
        queryKey: ['getClubProfileLiveApps'],
        queryFn: async () => {
          const res = await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/club/${clubId}/liveapps`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return res.data.data;
        },
        enabled: !!token,
      },
    ],
  });

  const clubProfileQuery = queries[0];

  if (clubProfileQuery.isLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />;
  }

  if (clubProfileQuery.isError) {
    return <>Error</>;
  }

  const { applications } = clubProfileQuery.data;

  return (
    <>
      <>
        <Paper pl="15%" pr="15%" pt="xl">
        <Flex direction="row" w="100%" px={40} mb={20} mt="lg">
            <Flex direction="column" w="85%" rowGap={10}>
              <Paper mt="sm">
                <Title order={1}> Applications </Title>
                <Text color={'gray.6'}>
                  View your club's live applications and click to see and grade their
                  applicants.
                </Text>
              </Paper>
            </Flex>
            <Flex
              direction="column"
              w="15%"
              align="center"
              justify="center"
            ></Flex>
          </Flex>

          {applications.length !== 0 ? (
            applications.map((app: Application, index: number) => (
              <ApplicationButtonMembersView key={index} application={app} />
            ))
          ) : (
            <Text size="xl" color="gray" fw={'bold'} italic align="center">
              No Applications yet!
            </Text>
          )}
        </Paper>
      </>
    </>
  );
};

ApplicationsMemberView.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default withValidateMembership(ApplicationsMemberView, 'membersOnly');
