import ApplicationsSpreadsheet from '@/components/applicationDashboard/applicationsSpreadsheet';
import EmptyApps from '@/components/applicationDashboard/emptyApps';
import WelcomeUser from '@/components/welcomeUser';
import useAuth from '@/hooks/useAuth';
import UserLayout from '@/layouts/userLayout';
import { Button, Center, Container, Text, LoadingOverlay } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ReactElement } from 'react';
import { NextPageWithLayout } from 'types/layout';

type Application = {
  id: number;
  appName: string;
  status: string;
  dueDate: string;
  clubName: string;
};

//gets app submissions for specific user
const fetchApps = async (token: string) => {
  return await axios({
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/applicationSubmission`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const fetchAuthThenApps = () => {
  //get token from auth0; need it as a header when making a http request
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return useQuery({
    queryKey: ['appSubmissionsGetForUser'],
    queryFn: () => fetchApps(token),
    enabled: !!token,
    refetchOnMount: true,
  });
};

const ApplicationDashboard: NextPageWithLayout = () => {
  const { data, isLoading, isError } = fetchAuthThenApps();

  if (isLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />
  }

  if (isError) {
    return <>Error</>;
  }

  //populate applications with appSubmission data
  const applications: Application[] = [];
  data.data.data.forEach((appSubmission: any) => {
    applications.push({
      id: appSubmission.id,
      status: appSubmission.status,
      appName: appSubmission.application.name,
      dueDate: appSubmission.application.deadline,
      clubName: appSubmission.application.club.name,
    });
  });

  if (applications.length === 0) {
    return <EmptyApps />;
  }
  return (
    <>
      <Container size={420} my={40}>
        <WelcomeUser />
        <Text color="black" size="md" align="center" mt={5} weight="500" italic>
          Here are your open applications:
        </Text>
      </Container>
      <ApplicationsSpreadsheet data={applications} />
    </>
  );
};

ApplicationDashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout> {page} </UserLayout>;
};

export default ApplicationDashboard;