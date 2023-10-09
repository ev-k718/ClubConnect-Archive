//@ts-nocheck
import {
  ActionIcon,
  Anchor,
  Button,
  Flex,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCalendar,
  IconClock,
  IconEdit,
  IconMap2,
  IconTrash,
  IconWorld,
} from '@tabler/icons-react';
import { useState } from 'react';

type Props = {
  id: number;
  eventName: string;
  description: string;
  location: string;
  link?: string;
  dateTime: Date;
};

const EventBanner = ({
  id,
  eventName,
  description,
  location,
  dateTime,
  link,
}: Props) => {
  const theme = useMantineTheme();
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const [opened, { close, open }] = useDisclosure(false);
  const [submittedValues, setSubmittedValues] = useState('');
  const form = useForm({
    initialValues: {
      eventName: eventName,
      description: description,
      location: location,
      link: link,
      date: dateTime,
      time: dateTime,
    },
    validate: (values) => ({
      eventName: !values.eventName && 'Event name is required',
      location: !values.location && 'Location is required',
      date: !values.date && 'Date is required',
      time: !values.time && 'Time is required',
    }),
  });

  const handleSave = () => {
    //TODO: save changes to database
    if (form.isValid()) {
      close();
    }
  };

  const handleDelete = () => {
    throw new Error('Function not implemented.');
  };

  const handleDiscard = () => {
    form.reset();
    close();
  };

  const dayAndDate = `${
    weekday[dateTime.getDay()]
  } ${dateTime.getMonth()}/${dateTime.getDate()}/${dateTime.getFullYear()}`;
  const hour = dateTime.getHours();
  const time = `${hour > 12 ? hour - 12 : hour}:${dateTime.getMinutes()} ${
    hour > 12 ? 'PM' : 'AM'
  }`;

  return (
    <>
      <Paper radius="sm" p="xl" withBorder shadow="md" mb={10}>
        <Group position="apart" align="center">
          <SimpleGrid cols={3} w="90%">
            <Stack spacing="xs" align="flex-start">
              <Text color={theme.other.custom_gray} fw="bold" size="sm">
                Name
              </Text>
              <Text fw="bold" size="md">
                {eventName}
              </Text>
            </Stack>
            <Stack spacing="xs" align="flex-start">
              <Text color={theme.other.custom_gray} fw="bold" size="sm">
                Time
              </Text>
              <Stack spacing={0}>
                <Text fw="bold" size="md" mb={4}>
                  {dayAndDate}
                </Text>
                <Text fw="bold" size="md">
                  {time}
                </Text>
              </Stack>
            </Stack>
            <Stack spacing="xs" align="flex-start">
              <Text color={theme.other.custom_gray} fw="bold" size="sm">
                Location
              </Text>
              <Stack spacing={0}>
                <Text fw="bold" size="md">
                  {location}
                </Text>
                {link ? (
                  <Anchor href={link} target="_blank" fw="bold">
                    Link
                  </Anchor>
                ) : null}
              </Stack>
            </Stack>
          </SimpleGrid>
          <Group position="center" spacing={1}>
            <ActionIcon onClick={() => handleDelete()}>
              <IconTrash />
            </ActionIcon>
            <ActionIcon onClick={open}>
              <IconEdit />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>

      <Modal
        centered
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        onClose={close}
        size="xl"
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        <form
          onSubmit={form.onSubmit((values) =>
            setSubmittedValues(JSON.stringify(values)),
          )}
        >
          <Flex direction="column" mx={15} rowGap={10}>
            <Title order={4} fw="bold" mb={5}>
              Edit Event
            </Title>
            <TextInput
              withAsterisk
              label="Event Name"
              placeholder="Your event name"
              {...form.getInputProps('eventName')}
            />

            <Group grow>
              <DatePicker
                clearable
                withAsterisk
                label="Pick a date"
                placeholder="The event date"
                minDate={new Date()}
                firstDayOfWeek="sunday"
                icon={<IconCalendar size={16} />}
                {...form.getInputProps('date')}
              />

              <TimeInput
                clearable
                withAsterisk
                label="Pick a time"
                placeholder="The event time"
                format="12"
                icon={<IconClock size={16} />}
                {...form.getInputProps('time')}
              />
            </Group>

            <Group grow>
              <TextInput
                withAsterisk
                label="Event Location"
                placeholder="Location"
                icon={<IconMap2 size={16} />}
                {...form.getInputProps('location')}
              />

              <TextInput
                label="Event Link"
                placeholder="Link"
                icon={<IconWorld size={16} />}
                {...form.getInputProps('link')}
              />
            </Group>

            <Textarea
              label="Event Description"
              placeholder="Description"
              {...form.getInputProps('description')}
            />

            <Flex align="center" justify="center" gap={2}>
              <Button variant="default" onClick={handleDiscard}>
                Discard
              </Button>
              <Button variant="default" type="submit" onClick={handleSave}>
                Save
              </Button>
            </Flex>
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default EventBanner;
