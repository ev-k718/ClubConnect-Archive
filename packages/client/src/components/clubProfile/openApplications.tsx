//@ts-nocheck
//can delete file
import { ActionIcon, Flex, Group, Paper, Text, Title } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

import ApplicationButton from '../applicationButton';

type Props = {
  clubId: number;
};

const sampleApplications = [
  {
    name: 'Sample Application',
    description: 'Sample Description',
    deadline: 'Sample Deadline',
    status: 'Sample Status',
  },
  {
    name: 'Sample Application',
    description: 'Sample Description',
    deadline: 'Sample Deadline',
    status: 'Sample Status',
  },
];

const OpenApplications = ({ clubId }: Props) => {
  const applications = sampleApplications.map((application, index) => (
    <ApplicationButton
      key={index}
      id={index}
      name={application.name}
      description={application.description}
      deadline={application.deadline}
      status={application.status}
    />
  ));

  return (
    <Paper radius="md" p="md" withBorder>
      <Flex direction="column" rowGap={10}>
        <Group position="apart" mb={5}>
          {/* TODO: Replace with actual link */}
          <Link href="#">
            <ActionIcon>
              <IconEdit />
            </ActionIcon>
          </Link>
        </Group>
        {applications}
      </Flex>
    </Paper>
  );
};

export default OpenApplications;
