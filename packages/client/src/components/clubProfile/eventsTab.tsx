import { Button, Flex, Paper, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import React from 'react';
import { ClubProfile, TimelineEvent } from 'types/dbTypes';

import EventEditorModal from './eventEditorModal';
import EventView from './eventView';

type Props = {
  clubProfile: ClubProfile;
};

const EventsTab = ({ clubProfile }: Props) => {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <>
      <Paper pl="15%" pr="15%" pt="xl">
        <Flex direction="row" w="100%" px={40} mb={20} mt="lg">
          <Flex direction="column" w="85%" rowGap={10}>
            <Paper mt="sm">
              <Title order={1}> Events </Title>
              <Text color={'gray.6'}>
                Manage your club's events and create new ones here.
              </Text>
            </Paper>
          </Flex>
          <Flex direction="column" w="15%" align="center" justify="center">
            <Button leftIcon={<IconPlus />} variant="outline" onClick={open}>
              Add Event
            </Button>
            <EventEditorModal
              opened={opened}
              close={close}
              event={null}
              clubProfileId={clubProfile.id}
            />
          </Flex>
        </Flex>

        {clubProfile.timelineEvents.length !== 0 ? (
          clubProfile.timelineEvents.map(
            (event: TimelineEvent, index: number) => (
              <EventView
                event={event}
                editable={true}
                key={index}
                clubProfileId={clubProfile.id}
              />
            ),
          )
        ) : (
          <Text size="xl" color="gray" fw={'bold'} italic align="center">
            No events yet!
          </Text>
        )}
      </Paper>
    </>
  );
};

export default EventsTab;
