//@ts-nocheck
import useAuth from '@/hooks/useAuth';
import {
  Button,
  Flex,
  Group,
  Modal,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconMap2,
  IconWorld,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import type { TimelineEvent } from '../../../types/dbTypes';

type Props = {
  opened: boolean;
  close: () => void;
  event: TimelineEvent | null;
  clubProfileId: string;
};

type EventFormValues = {
  eventName: string;
  location: string;
  description: string;
  link: string;
  date: Date | null;
  time: Date | null;
};

const EventEditorModal = ({ opened, close, event, clubProfileId }: Props) => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  const queryClient = useQueryClient();

  const generateForm = (event: TimelineEvent | null) => {
    if (event?.time) {
      event.time = new Date(event.time);
    }

    return useForm<EventFormValues>({
      initialValues: {
        eventName: event?.name || '',
        location: event?.location || '',
        description: event?.description || '',
        link: event?.link || '',
        date: event?.time || null,
        time: event?.time.toTimeString().split(' ')[0] || null,
      },
      validate: (values) => ({
        eventName: !values.eventName && 'Event name is required',
        location: !values.location && 'Location is required',
        date: !values.date && 'Date is required',
        time: !values.time && 'Time is required',
      }),
    });
    // console.log("hi droz");
  };

  const form = generateForm(event);

  const [prevFormValues, setPrevFormValues] = useState<EventFormValues>(
    form.values,
  );

  const createEvent = useMutation({
    mutationFn: (body: {}) => {
      return axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/clubProfile/${clubProfileId}/timelineEvent`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: body,
      });
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      showNotification({
        message: 'Created a new timeline event!',
        icon: <IconCheck size={16} />,
      });
    },
  });

  const updateEvent = useMutation({
    mutationFn: (body: {
      name: string;
      description: string;
      time: Date;
      location: string;
      link: string;
    }) => {
      return axios({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/clubProfile/timelineEvent/${event?.id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: body,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      showNotification({
        message: 'Updated timeline event!',
        icon: <IconCheck size={16} />,
      });
    },
  });

  const combineDateAndTime = (time: Date, date: Date) => {
    const tempTime = time.split(":");
    const dateObj = new Date(date);
    dateObj.setHours(tempTime[0]);
    dateObj.setMinutes(tempTime[1]);
    //dateObj.setHours(time.getHours());
    //dateObj.setMinutes(time.getMinutes());
    return dateObj;
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.isValid() || !form.values.date || !form.values.time) {
      form.validate();
      return;
    }

    const dateTime = combineDateAndTime(form.values.time, form.values.date);

    if (!event) {
      createEvent.mutate({
        name: form.values.eventName,
        description: form.values.description,
        time: dateTime,
        location: form.values.location,
        link: form.values.link,
      });
      form.reset();
    } else {
      updateEvent.mutate({
        name: form.values.eventName,
        description: form.values.description,
        time: dateTime,
        location: form.values.location,
        link: form.values.link,
      });
      setPrevFormValues(form.values);
    }

    close();
  };

  const handleDiscard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.setValues(prevFormValues);
    close();
  };

  return (
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
      <form onSubmit={(e) => handleSave(e)} onReset={(e) => handleDiscard(e)}>
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
            <Button variant="default" type="reset">
              Discard
            </Button>
            <Button variant="default" type="submit">
              Save
            </Button>
          </Flex>
        </Flex>
      </form>
    </Modal>
  );
};

export default EventEditorModal;
