import useAuth from '@/hooks/useAuth';
import {
  Button,
  Center,
  Checkbox,
  Modal,
  Switch,
  TextInput,
} from '@mantine/core';
import { ActionIcon, Badge, Flex } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle, IconAt, IconCheck } from '@tabler/icons-react';
import { IconUserPlus, IconX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const getToken = () => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return token;
};

type Props = {
  opened: boolean;
  close: () => void;
};

const isEmail = (email: string) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const AddOwnerOrMemberModal = ({ opened, close }: Props) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [emailEntered, setEmailEntered] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const token = getToken();
  const router = useRouter();
  const { clubId } = router.query;
  const queryClient = useQueryClient();
  const [addingOwner, setAddingOwner] = useState(false);

  const resetStates = () => {
    setEmailEntered(false);
    setAddingOwner(false);
    setEmailAddress('');
  };

  const closeModal = () => {
    close();
    resetStates();
    setEmailError(false);
  };

  const addPersonToClub = useMutation({
    mutationFn: async (body: { userId: string; clubId: string }) => {
      const res = await axios({
        method: addingOwner ? 'put' : 'post',
        url: addingOwner
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/club/addOwner/${clubId}
          `
          : `${process.env.NEXT_PUBLIC_API_URL}/api/clubMember`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: body,
      });
      return res;
    },
    onError: (error: any) => {
      if (error.response.status === 400) {
        showNotification({
          message: `User is already a ${
            addingOwner ? 'owner' : 'member'
          } of this club`,
          icon: <IconAlertTriangle size={16} />,
          color: 'red',
        });
      } else {
        showNotification({
          message: `Error adding new club ${addingOwner ? 'owner' : 'member'}`,
          icon: <IconX size={16} />,
          color: 'red',
        });
        resetStates();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      close();
      showNotification({
        message: `Added New Club ${addingOwner ? 'owner' : 'member'}`,
        icon: <IconCheck size={16} />,
      });
      resetStates();
    },
  });

  const getUserByEmail = useMutation({
    mutationFn: async () => {
      const res = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/getUserGivenEmail/${emailAddress}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onError: () => {
      showNotification({
        message: 'A  user with that email does not exist',
        icon: <IconAlertTriangle size={16} />,
        color: 'red',
      });
    },
    onSuccess: ({ data: user }: any) => {
      addPersonToClub.mutate({ userId: user?.id, clubId: clubId as string });
    },
  });

  const handleEnter = () => {
    if (isEmail(emailAddress)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
    setEmailEntered(true);
  };

  const handleAddMember = () => {
    getUserByEmail.mutate();
  };

  const emailBox = () => {
    return (
      <Badge
        size="xl"
        variant="outline"
        m="1rem"
        rightSection={
          <Center>
            <IconX />
          </Center>
        }
        onClick={() => {
          setEmailError(false);
          resetStates();
        }}
      >
        {emailAddress}
      </Badge>
    );
  };

  return (
    <Modal opened={opened} onClose={closeModal} title="Add a Member" centered>
      <Flex direction="row" w="100%" justify={'center'}>
        <TextInput
          disabled={emailEntered}
          value={emailAddress}
          placeholder="Enter the person's email"
          size="lg"
          icon={<IconAt size="1.5rem" />}
          error={emailError ? 'Please enter a valid email' : null}
          onChange={(event) => {
            setEmailAddress(event.target.value);
          }}
          onKeyDown={getHotkeyHandler([['Enter', handleEnter]])}
        />
      </Flex>

      <Flex direction="column" w="100%" align={'center'} mt="sm">
        {!emailError && (
          <Checkbox
            label="Make this user an owner"
            disabled={emailEntered && !emailError}
            checked={addingOwner}
            onChange={(event) => setAddingOwner(event.target.checked)}
          />
        )}

        {emailEntered ? (
          emailBox()
        ) : (
          <>
            <Button onClick={handleEnter} m={10}>
              Search for user email
            </Button>
          </>
        )}
      </Flex>

      <Flex direction="column" w="100%" align={'center'}>
        {emailEntered && !emailError && (
          <>
            <Button
              leftIcon={<IconUserPlus />}
              variant="light"
              color="green"
              onClick={handleAddMember}
            >
              Add
            </Button>
          </>
        )}
      </Flex>
    </Modal>
  );
};

export default AddOwnerOrMemberModal;
