import useAuth from '@/hooks/useAuth';
import { Button, Flex, HoverCard, Paper, Text, Title } from '@mantine/core';
import { IconArrowRight, IconCodeCircle } from '@tabler/icons-react';
import { IconDots } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';

//application object
type Props = {
  application: {
    id: number;
    clubId: number;
    status: string;
    name: string;
    description: string;
    deadline: string;
    openDate: string;
    createdAt: string;
    updatedAt: string;
  };
};

const getToken = () => {
  const { getAccessToken: getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return token;
};

const ApplicationBox = ({ application }: Props) => {
  const router = useRouter();
  const token = getToken();

  const queryClient = useQueryClient();

  const createAppSubmission = useMutation({
    mutationFn: () => {
      return axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/applicationSubmission`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          applicationId: application.id,
        },
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      router.push('/applicant/application-dashboard/' + data.data.data.id);
    },
  });

  return (
    <Paper radius="lg" p="md" withBorder w="85%">
      <Flex direction="row" w="100%">
        <Flex direction="column" w="10%">
          <IconCodeCircle />
        </Flex>
        <Flex direction="column" w="80%">
          <Title order={6} c="gray.9">
            {application.name.slice(0, 50) +
              (application.name.length > 50 ? '...' : '')}
          </Title>
          
          <Text c="gray.7">
            {application.description.slice(0, 300) +
              (application.description.length > 300 ? '...' : '')}
          </Text>
          <Title order={5} c="gray.9">
            Deadline:{' '}
            {new Date(application.deadline).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Title>
          <Button
            rightIcon={<IconArrowRight />}
            variant="white"
            onClick={(event) => {
              event.preventDefault();
              createAppSubmission.mutate();
            }}
          >
            Apply
          </Button>
        </Flex>
      </Flex>
    </Paper>
  );
};

export default ApplicationBox;
