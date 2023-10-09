import withValidateMembership from '@/HOC/withValidateMembership';
import ApplicationsTab from '@/components/clubProfile/applicationsTab';
import ClubInfoTab from '@/components/clubProfile/clubInfoTab';
import EventsTab from '@/components/clubProfile/eventsTab';
import MembersTab from '@/components/clubProfile/membersTab';
import LoadingView from '@/components/loadingView';
import useAuth from '@/hooks/useAuth';
import AdminLayout from '@/layouts/adminLayout';
import { Flex, Tabs, Title, LoadingOverlay } from '@mantine/core';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import type { ClubProfile } from 'types/dbTypes';
import { NextPageWithLayout } from 'types/layout';

const ClubProfilePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { clubId } = router.query;
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();

  const queries = useQueries({
    queries: [
      {
        queryKey: ['getClubProfile'],
        queryFn: async () => {
          const res = await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/club/${clubId}`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return res.data.data;
        },
        enabled: !!token,
      },
      {
        queryKey: ['getClubOwned'],
        queryFn: async () => {
          const res = await axios({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/club/getClubOwners/${clubId}`,
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
  const clubOwnerQuery = queries[1];

  if (clubProfileQuery.isLoading || clubOwnerQuery.isLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />;
  }

  if (clubProfileQuery.isError || clubOwnerQuery.isError) {
    return <>Error</>;
  }

  const {
    clubProfile: clubProfileData,
    members,
    applications,
    name,
  } = clubProfileQuery.data;

  const { owners } = clubOwnerQuery.data;

  return (
    <>
      <Flex direction="row" w="100%" justify={'center'} mt={10}>
        <Title order={3}>{name}</Title>
      </Flex>

      <Tabs defaultValue="club-info" pt="md">
        <Tabs.List position="center">
          <Tabs.Tab value="club-info">Club Information</Tabs.Tab>
          <Tabs.Tab value="applications">Applications</Tabs.Tab>
          <Tabs.Tab value="events">Events</Tabs.Tab>
          <Tabs.Tab value="members">Members</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="club-info">
          <ClubInfoTab clubProfile={clubProfileData} />
        </Tabs.Panel>
        <Tabs.Panel value="applications">
          <ApplicationsTab
            applications={applications}
            clubId={clubProfileData.clubId}
          />
        </Tabs.Panel>
        <Tabs.Panel value="events">
          <EventsTab clubProfile={clubProfileData} />
        </Tabs.Panel>
        <Tabs.Panel value="members">
          <MembersTab members={members} owners={owners} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

ClubProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default withValidateMembership(ClubProfilePage, 'ownerOnly');
