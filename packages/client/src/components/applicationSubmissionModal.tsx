import useAuth from '@/hooks/useAuth';
import { Button, Flex, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';

type Props = {
  appSubmissionId: string;
  opened: boolean;
  close: () => void;
  saveChanges: UseMutateAsyncFunction<
    AxiosResponse<any, any>,
    unknown,
    React.MouseEvent<HTMLButtonElement, MouseEvent>,
    unknown
  >;
};

const ApplicationSubmissionModal = ({
  appSubmissionId,
  opened,
  close,
  saveChanges,
}: Props) => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  const queryClient = useQueryClient();
  const router = useRouter();

  const submitApplicationSub = useMutation({
    mutationFn: async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      await saveChanges(e);
      return await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicationSubmission/submitApplicationSubmission/${appSubmissionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      close();
      showNotification({
        message: 'Your application has been submitted',
        icon: <IconCheck size={16} />,
      });
      router.push('/applicant/application-dashboard/');
    },
    onError: () => {
      showNotification({
        message: 'Error submitting application',
        icon: <IconAlertTriangle size={16} />,
        color: 'red',
      });
      close();
    },
  });

  return (
    <Modal opened={opened} onClose={close} centered>
      <Flex direction="row" w="100%" justify={'center'} mb="sm">
        <IconAlertTriangle color="red" />
      </Flex>
      <Flex direction="row" w="100%" justify={'center'}>
        <Text color="red" fz="md" weight={'bold'}>
          Are you sure you would like to submit?
        </Text>
      </Flex>
      <Flex direction="row" w="100%" align={'center'} mt="md" mb="md">
        <Text color="gray.6" ta={'center'}>
          Your application will be saved an extra time before submission to make
          sure we capture all of your changes. You will no longer be able to
          edit your application. This action cannot be undone.
        </Text>
      </Flex>
      <Flex direction="row" w="100%" justify={'center'}>
        <Button color={'red'} onClick={(e) => submitApplicationSub.mutate(e)}>
          Confirm Submission
        </Button>
      </Flex>
    </Modal>
  );
};

export default ApplicationSubmissionModal;
