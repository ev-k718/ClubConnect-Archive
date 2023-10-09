import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Application } from 'types/dbTypes';
import DeleteApplicationModal from './deleteApplicationModal';

import PreviewApplication from './previewApplication/previewApplication';

type Props = {
  application: Application;
};

const ApplicationButton = ({ application }: Props) => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false); // Handle Modal
  const router = useRouter();
  const [
    openedApplicationDeleteModal,
    { close: closeApplicationDeleteModal, open: openApplicationDeleteModal },
  ] = useDisclosure(false);

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const isLiveOrDead = application.status === "LIVE" || application.status === "CLOSED";

  const handleClickEditApp = () => {
    router.push(
      '/member/' +
        application.clubId +
        '/' +
        application.id +
        '/edit-application',
    );
  };

  return (
    <Paper radius="sm" p="xl" withBorder shadow="md">
       <DeleteApplicationModal
          applicationId={application.id ? application.id : ""}
          clubId = {application.clubId}
          opened={openedApplicationDeleteModal}
          close={closeApplicationDeleteModal}
          key={`${application.id}deleteModal`}
        />
      <Modal opened={opened} onClose={close} size="70%">
        <PreviewApplication
          doesExist={true}
          modalInfo={{
            name: application.name,
            description: application.description,
            questions: application.questions,
            publishDate: new Date(application.openDate),
            deadlineDate: new Date(application.deadline),
          }}
        ></PreviewApplication>
      </Modal>
      <Group position="apart" align="center">
        <SimpleGrid cols={3} w="80%">
          <Stack spacing="xs" align="flex-start">
            <Text color={theme.other.custom_gray} fw="bold" size="sm">
              Name
            </Text>
            <Text fw="bold" size="md">
              {application.name}
            </Text>
          </Stack>

          <Stack spacing="xs" align="flex-start">
            <Text color={theme.other.custom_gray} fw="bold" size="sm">
              Deadline
            </Text>
            <Text fw="bold" size="md">
              {new Date(application.deadline).toLocaleString(
                'en-US',
                dateTimeOptions,
              )}
            </Text>
          </Stack>
          <Stack spacing="xs" align="flex-start">
            <Text color={theme.other.custom_gray} fw="bold" size="sm">
              Status
            </Text>
            <Text fw="bold" size="md">
              {application.status}
            </Text>
          </Stack>
        </SimpleGrid>
        <Flex columnGap={1}>
          <ActionIcon onClick={handleClickEditApp} disabled={isLiveOrDead}>
            <IconEdit />
          </ActionIcon>
          <ActionIcon onClick={open}>
            <IconEye />
          </ActionIcon>
          <ActionIcon onClick={openApplicationDeleteModal}>
            <IconTrash />
          </ActionIcon>
        </Flex>
      </Group>
    </Paper>
  );
};

export default ApplicationButton;
