import useAuth from '@/hooks/useAuth';
import { Button, Flex, Modal, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { Axios } from 'axios';
import router from 'next/router';

type Props = {
  isOwner: boolean;
  id: string;
  name: string;
  opened: boolean;
  close: () => void;
};

const DeleteOwnerOrMemberModal = ({
  isOwner,
  id,
  name,
  opened,
  close,
}: Props) => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  const queryClient = useQueryClient();
  const { clubId } = router.query;

  const deleteMember = useMutation({
    mutationFn: (e: any) => {
      e.preventDefault();
      return axios({
        method: isOwner ? 'PUT' : 'DELETE',
        url: isOwner
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/club/removeOwner/${clubId}/${id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/clubMember/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      close();
      showNotification({
        message: `Removed Club ${isOwner ? 'Owner' : 'Member'}`,
        icon: <IconCheck size={16} />,
      });
    },
    onError: (error: any) => {
      close();
      if (
        error.response.status === 400 &&
        error.response.data.message === 'You cannot remove yourself as an owner'
      ) {
        showNotification({
          message: `You cannot remove yourself as an owner`,
          icon: <IconAlertTriangle size={16} />,
          color: 'red',
        });
      } else if (
        error.response.status === 400 &&
        error.response.data.message === 'Cannot remove last owner of club'
      ) {
        showNotification({
          title: `Cannot remove last owner of club`,
          message: `You must add another owner before removing the last owner`,
          icon: <IconAlertTriangle size={16} />,
          color: 'red',
          autoClose: 5000,
        });
      } else {
        showNotification({
          message: `Error Deleting Club ${isOwner ? 'Owner' : 'Member'}`,
          icon: <IconAlertTriangle size={16} />,
        });
      }
    },
  });

  return (
    <Modal opened={opened} onClose={close} centered>
      <Flex direction="row" w="100%" justify={'center'} mb="sm">
        <IconAlertTriangle color="red" />
      </Flex>
      <Flex direction="row" w="100%" justify={'center'}>
        <Text color="red" fz="md" weight={'bold'}>
          Delete Club {isOwner ? 'Owner' : 'Member'}
        </Text>
      </Flex>
      <Flex direction="row" w="100%" align={'center'} mt="md" mb="md">
        <Text color="gray.6">
          Do you really want to remove {name} from your club? This action cannot
          be undone.
        </Text>
      </Flex>
      <Flex direction="row" w="100%" justify={'center'}>
        <Flex direction="column" w="80%"></Flex>

        <Flex direction="column" w="20%" justify={'center'}>
          <Button color={'red'} onClick={(e) => deleteMember.mutate(e)} p={2}>
            Delete
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default DeleteOwnerOrMemberModal;
