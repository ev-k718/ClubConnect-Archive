import {
  ActionIcon,
  Divider,
  Flex,
  HoverCard,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendarEvent,
  IconDots,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

import type { TimelineEvent } from '../../../types/dbTypes';
import EventDeleteModal from './eventDeleteModal';
import EventEditorModal from './eventEditorModal';

type Props = {
  event: TimelineEvent;
  editable: boolean;
  clubProfileId: string;
};

export const EventView = ({ event, editable, clubProfileId }: Props) => {
  const [
    openedEventEditor,
    { close: closeEventEditor, open: openEventEditor },
  ] = useDisclosure(false);
  const [
    openedEventDeleteModal,
    { close: closeEventDeleteModal, open: openEventDeleteModal },
  ] = useDisclosure(false);

  const displayEditorOption = () => {
    return (
      <>
        <Flex direction="column" w="10%" />
        <Flex direction="row" w="5%" align={'center'} columnGap={3}>
          <ActionIcon size="md" onClick={openEventEditor}>
            <IconEdit />
          </ActionIcon>
          <ActionIcon size="md" onClick={openEventDeleteModal}>
            <IconTrash />
          </ActionIcon>
        </Flex>
        <EventEditorModal
          opened={openedEventEditor}
          close={closeEventEditor}
          event={event}
          clubProfileId={clubProfileId}
          key={`${event.id}editorModal`}
        />
        <EventDeleteModal
          eventId={event.id}
          opened={openedEventDeleteModal}
          close={closeEventDeleteModal}
          eventName={event.name}
          key={`${event.id}deleteModal`}
        />
      </>
    );
  };

  //convert the date to required format for google calendar link
  const parsedDate = new Date(event.time);
  const formattedDate = `${parsedDate.getFullYear()}${(
    '0' +
    (parsedDate.getMonth() + 1)
  ).slice(-2)}${('0' + parsedDate.getDate()).slice(-2)}T${(
    '0' + parsedDate.getHours()
  ).slice(-2)}${('0' + parsedDate.getMinutes()).slice(-2)}${(
    '0' + parsedDate.getSeconds()
  ).slice(-2)}`;
  //since no event durations, by default set them to 1 hour long on google calndar
  const oneHourLater = new Date(parsedDate);
  oneHourLater.setHours(oneHourLater.getHours() + 1);
  const formattedEndDate = `${oneHourLater.getFullYear()}${(
    '0' +
    (oneHourLater.getMonth() + 1)
  ).slice(-2)}${('0' + oneHourLater.getDate()).slice(-2)}T${(
    '0' + oneHourLater.getHours()
  ).slice(-2)}${('0' + parsedDate.getMinutes()).slice(-2)}${(
    '0' + oneHourLater.getSeconds()
  ).slice(-2)}`;

  const calendarLink =
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' +
    event.name +
    '&details=' +
    event.description +
    '&dates=' +
    formattedDate +
    '/' +
    formattedEndDate +
    '&ctz=America/NewYork&location=' +
    event.location;

  return (
    <Paper p="md">
      <Divider orientation="horizontal" color={'gray.4'} />
      <Flex direction="row" w="100%" mt="md">
        <Flex direction="column" w="15%">
          <Text c="gray.7">
            {new Date(event.time).toLocaleDateString(undefined, {
              month: 'long',
            })}
          </Text>
          <Title order={2} ml="md" c="gray.8">
            {new Date(event.time).toLocaleDateString(undefined, {
              day: 'numeric',
            })}
          </Title>
        </Flex>
        <Divider orientation="vertical" color={'gray.4'} />

        <Flex direction="column" w="50%" ml="lg" c="gray.7">
          <Flex direction="row" w="100%" align={'center'}>
            <IconCalendarEvent />
            <Text fz="lg" c="gray.9" ml="lg">
              {event.name}
            </Text>
          </Flex>
          <Text ml={45}>
            {new Date(event.time).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </Text>
          <Text ml={45}> {event.location}</Text>
        </Flex>

        <Flex direction="column" w="40%" c="gray.7">
          {event.description.slice(0, 100)+ (event.description.length > 100 ? "..." : "")}
          <HoverCard width={350} shadow="md">
            <HoverCard.Target>
              <IconDots />
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">{event.description}</Text>
            </HoverCard.Dropdown>
          </HoverCard>
          <Link href={calendarLink} target="_blank" rel="noopener noreferrer">
            <Text>Add to Calendar</Text>
          </Link>
        </Flex>
        {editable ? displayEditorOption() : <></>}
      </Flex>
    </Paper>
  );
};

export default EventView;
