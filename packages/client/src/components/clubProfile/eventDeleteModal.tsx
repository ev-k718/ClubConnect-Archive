import useAuth from '@/hooks/useAuth';
import { Button, Flex, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MouseEvent } from 'react';

type Props = {
  eventId: string;
  eventName: string;
  opened: boolean;
  close: () => void;
};

const eventDeleteModal = ({ eventId, opened, close, eventName }: Props) => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  const queryClient = useQueryClient();

  const deleteEvent = useMutation({
    mutationFn: (e: MouseEvent) => {
      e.preventDefault();
      return axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clubProfile/timelineEvent/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      showNotification({
        message: 'Deleted Event Successfully',
        icon: <IconCheck size={16} />,
      });
      close();
    },
    onError: () => {
      close();
      showNotification({
        message: 'Error Deleting Event',
        icon: <IconAlertTriangle size={16} />,
        color: 'red',
      });
    },
  });

  return (
    <Modal opened={opened} onClose={close} centered>
      <Flex direction="row" w="100%" justify={'center'} mb="sm">
        <IconAlertTriangle color="red" />
      </Flex>
      <Flex direction="row" w="100%" justify={'center'}>
        <Text color="red" fz="md" weight={'bold'}>
          Delete Event
        </Text>
      </Flex>
      <Flex direction="row" w="100%" align={'center'} mt="md" mb="md">
        <Text color="gray.6">
          Do you really want to delete the event called {eventName} from your
          club? This action cannot be undone.
        </Text>
      </Flex>
      <Flex direction="row" w="100%" justify={'center'}>
        <Flex direction="column" w="80%"></Flex>
        <Flex direction="column" w="20%" justify={'center'}>
          <Button color={'red'} onClick={(e) => deleteEvent.mutate(e)} p={2}>
            Delete
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default eventDeleteModal;
