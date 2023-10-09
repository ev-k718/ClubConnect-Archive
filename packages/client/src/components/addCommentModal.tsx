import useAuth from '@/hooks/useAuth';
import {
  Button,
  Center,
  Modal,
  SimpleGrid,
  Text,
  Textarea,
} from '@mantine/core';
import { Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const AddCommentModal = (props: {
  applicationSubmissionId: string;
  applicationId: string;
}) => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  const [opened, { open, close }] = useDisclosure(false);
  const [comment, setComment] = useState('');

  const addNewComment = useMutation({
    mutationFn: async () => {
      await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/applicationSubmission/${props.applicationSubmissionId}/comment`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          value: comment,
        },
      });
    },
    onSuccess: () => {
      showNotification({
        message: 'Comment posted!',
        icon: <IconCheck size={16} />,
      });
      queryClient.invalidateQueries();
      setComment('');
    },
    onError: (error) => {
      showNotification({
        message: 'Error posting comment.',
        color: 'red',
        icon: <IconAlertTriangle size={16} />,
      });
    },
  });

  return (
    <>
      <Center>
        <Button variant="light" onClick={open}>
          + New comment
        </Button>
      </Center>
      <Modal
        opened={opened}
        onClose={close}
        shadow='sm'
        centered
        closeOnClickOutside
        trapFocus
      >
        <SimpleGrid cols={1}>
          <Center>
            <h2>New comment</h2>
          </Center>
          <Textarea
            onInput={(e) => setComment(e.currentTarget.value)}
          ></Textarea>
          <Button
            onClick={() => {
              if (comment.replace(/\s/g, '').length) {
                addNewComment.mutate();
              }
              close();
            }}
          >
            Post
          </Button>
        </SimpleGrid>
      </Modal>
    </>
  );
};

export default AddCommentModal;
