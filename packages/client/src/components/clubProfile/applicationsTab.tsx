import { Button, Flex, Paper, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import React from 'react';
import { Application } from 'types/dbTypes';

import ApplicationButton from '../applicationButton';
import OpenApplications from './openApplications';

type Props = {
  applications: Application[];
  clubId: string;
};

const ApplicationsTab = ({ applications, clubId }: Props) => {
  const router = useRouter();

  const handleCreate = () => {
    router.push('/member/' + clubId + '/create-application');
  };

  return (
    <>
      <Paper pl="15%" pr="15%" pt="xl">
        <Flex direction="row" w="100%" px={40} mb={20} mt="lg">
          <Flex direction="column" w="85%" rowGap={10}>
            <Paper mt="sm">
              <Title order={1}> Applications </Title>
              <Text color={'gray.6'}>
                Manage your club's applications and create new ones here.
              </Text>
            </Paper>
          </Flex>
          <Flex direction="column" w="15%" align="center" justify="center">
            <Button
              leftIcon={<IconPlus />}
              variant="outline"
              onClick={handleCreate}
            >
              New Application
            </Button>
          </Flex>
        </Flex>

        {applications.length !== 0 ? (
          applications.map((app: Application, index: number) => (
            <ApplicationButton key={index} application={app} />
          ))
        ) : (
          <Text size="xl" color="gray" fw={'bold'} italic align="center">
            No Applications yet!
          </Text>
        )}
      </Paper>
    </>
  );
};

export default ApplicationsTab;
