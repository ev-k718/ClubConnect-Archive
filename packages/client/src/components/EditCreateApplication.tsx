import useAuth from '@/hooks/useAuth';
import useNavigationLock from '@/hooks/useNavigationLock';
import {
  Button,
  Center,
  Checkbox,
  Divider,
  Grid,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconCheck,
  IconGripVertical,
  IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import PreviewApplication from './previewApplication/previewApplication';

type Question = {
  id: string;
  applicationId: string;
  value: string;
  type: string;
  isRequired: boolean;
};

type Props = {
  applicationId: string | null;
  unsaved: boolean;
  setUnsaved: Dispatch<SetStateAction<boolean>>;
};

type statusType = 'DRAFT' | 'LIVE';

const EditCreateApplication = ({
  applicationId,
  unsaved,
  setUnsaved,
}: Props) => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  const router = useRouter();

  const clubId = router.query.clubId as string;

  const [datePickerPublish, setDatePickerPublish] = useState<Date | null>();
  const [datePickerDeadline, setDatePickerDeadline] = useState<Date | null>();
  const [name, setName] = useState(String);
  const [publishDate, setDate] = useState(new Date());
  const [deadlineDate, setDeadline] = useState(new Date());
  const [description, setDescription] = useState(String);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [opened, { open, close }] = useDisclosure(false); // Handle Modal
  const [showUIElements, setShowUIElements] = useState(false);
  const [initialFetch, setInitialFetch] = useState(true);

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      publishDate: new Date(),
      deadlineDate: new Date(),
      questions: [
        {
          id: '',
          applicationId: '',
          value: '',
          type: 'TEXT_IN',
          isRequired: true,
        },
      ],
    },
  });

  const scoringForm = useForm({
    initialValues: {
      scoringCriteria: [
        {
          id: '',
          applicationId: '',
          description: '',
        },
      ],
    },
  });

  const datePickerOnChangePublish = (value: Date) => {
    if (datePickerDeadline && value > datePickerDeadline) {
      setDatePickerDeadline(value);
      form.setFieldValue('deadlineDate', value);
    }
    setDatePickerPublish(value);
    form.setFieldValue('publishDate', value);
  };

  const datePickerOnChangeDeadline = (value: Date) => {
    if (datePickerPublish && value < datePickerPublish) {
      setDatePickerPublish(value);
      form.setFieldValue('publishDate', value);
    }
    setDatePickerDeadline(value);
    form.setFieldValue('deadlineDate', value);
  };

  const checkIfEmptyOrInvalidDate = () => {
    if (
      form.values.questions.length === 0 ||
      form.values.name === '' ||
      form.values.description === '' ||
      form.values.publishDate === null ||
      form.values.deadlineDate === null
    ) {
      showNotification({
        message: 'Please fill out all the fields',
        icon: <IconAlertTriangle size={16} />,
        color: 'red',
      });
      return true;
    }
    var date = new Date(form.values.deadlineDate);
    date.setDate(date.getDate() - 1);
    const publishDate = new Date(form.values.publishDate);
    if (publishDate > date) {
      showNotification({
        message:
          'Please make sure the deadline is at least a day after the publish date',
        icon: <IconAlertTriangle size={16} />,
        color: 'red',
      });
      return true;
    }
    if (form.values.questions.some((question) => question.value === '')) {
      showNotification({
        message: 'Please make sure none of the questions are empty',
        icon: <IconAlertTriangle size={16} />,
        color: 'red',
      });
      return true;
    }
    if (scoringForm.values.scoringCriteria.some((criteria) => criteria.description === '')) {
      showNotification({
        message: 'Please make sure none of the criteria are empty',
        icon: <IconAlertTriangle size={16} />,
        color: 'red',
      });
      return true;
    }
    return false;
  };

  const { isError, isFetching } = useQuery({
    queryKey: ['EditingCreatingApplication'],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/application/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    },
    onSuccess: (application) => {
      if (application.status === 'LIVE' || application.status === 'CLOSED') {
        router.push('/member/' + clubId);
      }
      form.setValues({
        name: application.name,
        description: application.description,
        publishDate: application.openDate,
        deadlineDate: application.deadline,
        questions: application.questions,
      });
      scoringForm.setValues({
        scoringCriteria: application.scoringCriteria,
      });
      setDatePickerPublish(new Date(application.openDate));
      setDatePickerDeadline(new Date(application.deadline));
      setUnsaved(false);
      setInitialFetch(true);
    },
    refetchOnWindowFocus: false,
    enabled: !!token && !!applicationId,
  });

  const editApplication = useMutation({
    mutationFn: (status: statusType) => {
      setUnsaved(false);
      return axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/application/${applicationId}`,
        {
          data: {
            name: form.values.name,
            description: form.values.description,
            openDate: form.values.publishDate,
            deadline: form.values.deadlineDate,
            questions: form.values.questions,
            status: status,
            scoringCriteria: scoringForm.values.scoringCriteria,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setUnsaved(false);
      setInitialFetch(true);
      showNotification({
        message: 'Application changes saved',
        icon: <IconCheck />,
      });
    },
  });

  const createApplication = useMutation({
    mutationFn: async (status: statusType) => {
      setUnsaved(false);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/application`,
        {
          data: {
            clubId: clubId,
            name: form.values.name,
            description: form.values.description,
            openDate: form.values.publishDate,
            deadline: form.values.deadlineDate,
            questions: form.values.questions,
            status: status,
            scoringCriteria: scoringForm.values.scoringCriteria,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.data;
    },
    onSuccess: (application) => {
      queryClient.invalidateQueries();
      showNotification({
        message: 'Application Created',
        icon: <IconCheck />,
      });
      setUnsaved(false);
      setInitialFetch(true);
      router.push(`/member/${clubId}/${application.id}/edit-application`);
    },
  });

  const closeApplication = () => {
    router.push(`/member/${clubId}`);
  };

  useEffect(() => {
    setName(form.values.name);
    setDate(form.values.publishDate);
    setDeadline(form.values.deadlineDate);
    setDescription(form.values.description);
    setQuestions(form.values.questions);
    if (!initialFetch) {
      setUnsaved(true);
    }
    setInitialFetch(false);
  }, [
    form.values.deadlineDate,
    form.values.publishDate,
    form.values.questions,
    form.values.name,
    form.values.description,
    scoringForm.values,
  ]);

  const publishApplication = async () => {
    if (checkIfEmptyOrInvalidDate()) {
      return;
    }
    if (applicationId) {
      await editApplication.mutateAsync('LIVE');
    } else {
      await createApplication.mutateAsync('LIVE');
    }
    router.push('/member/' + clubId);
    showNotification({
      message: `Application ${name} published`,
      icon: <IconCheck />,
    });
  };

  useEffect(() => {
    setShowUIElements(true);
  }, []);

  // Maps questions to the UI
  const fields = form.values.questions?.map((_, index) => (
    <Draggable
      key={index.toString()}
      index={index}
      draggableId={index.toString()}
    >
      {(provided, snapshot) => (
        <Paper
          p="lg"
          radius="md"
          withBorder
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{ padding: 10, margin: 10 }}
          data-cy="q"
        >
          <Center {...provided.dragHandleProps}>
            <IconGripVertical size={18} />
          </Center>
          <Stack>
            <Grid>
              <Grid.Col xs={9}>
                <TextInput
                  label="Question"
                  placeholder="Enter question"
                  {...form.getInputProps(`questions.${index}.value`)}
                />
              </Grid.Col>
              <Grid.Col xs={3} >
                <Select
                  data={[
                    { label: 'File Input', value: 'FILE_UPLOAD' },
                    { label: 'Text Input', value: 'TEXT_IN' },
                    // { label: 'Muliple Choice', value: 'mcq' },
                  ]}
                  {...form.getInputProps(`questions.${index}.type`)}
                  label="Question Type"
                />
              </Grid.Col>
            </Grid>
            <Group>
              <Button
                onClick={() => form.removeListItem('questions', index)}
                size="xs"
                variant="outline"
                data-cy="remove"
              >
                <IconTrash />
              </Button>
              <Checkbox
                label="Required"
                {...form.getInputProps(`questions.${index}.isRequired`, {
                  type: 'checkbox',
                })}
                size="sm"
                color={'red'}
              />
            </Group>
          </Stack>
        </Paper>
      )}
    </Draggable>
  ));

  const scoringCriteriaFields = scoringForm.values.scoringCriteria.map(
    (_, index) => (
      <Grid sx={{ padding: 10, margin: 10 }}>
        <Grid.Col span = {9}>
      <TextInput
        placeholder="Enter scoring criteria"
        {...scoringForm.getInputProps(`scoringCriteria.${index}.description`)}
      />
      </Grid.Col>
      <Grid.Col span = {3}>
      <Button
      onClick={() => scoringForm.removeListItem('scoringCriteria', index)}
      variant="outline"
      data-cy="remove"
    >
      <IconTrash />
    </Button>
    </Grid.Col>
    </Grid>
    ),
  );

  if (isFetching) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>Error...</>;
  }

  return (
    <>
      <Modal opened={opened} onClose={close} size="70%">
        <PreviewApplication
          doesExist={true}
          modalInfo={{
            name: name,
            description: description,
            questions: questions,
            publishDate: publishDate,
            deadlineDate: deadlineDate,
          }}
        ></PreviewApplication>
      </Modal>

      <ScrollArea offsetScrollbars>
        <Group position="center" sx={{ padding: 20 }}>
          <Button variant="outline" onClick={open}>
            Preview Form
          </Button>
          {applicationId ? (
            <Button
              variant="outline"
              onClick={() => editApplication.mutate('DRAFT')}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => createApplication.mutate('DRAFT')}
            >
              Create Application
            </Button>
          )}
          <Divider orientation="vertical" />
          <Button color="red" onClick={closeApplication}>
            Close
          </Button>
          <Button onClick={publishApplication}>Publish</Button>
        </Group>

        <Text ta="center" fz="xl" fw={700} sx={{ marginTop: 10 }}>
          Information
        </Text>
        <Grid
          sx={{
            padding: 10,
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 20,
          }}
          grow
          gutter="xs"
        >
          <Grid.Col span={5}>
            <Stack sx={{ marginLeft: 14 }}>
              <Textarea
                label="Name"
                data-cy="name"
                placeholder="Enter application name"
                {...form.getInputProps('name')}
                autosize
                maxRows={1}
                withAsterisk
              />

              <Textarea
                label="Description"
                autosize
                minRows={4}
                placeholder="Enter application description"
                data-cy="description"
                {...form.getInputProps('description')}
                withAsterisk
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span={1}>
            <Stack align="flex-end">
              <DateTimePicker
                placeholder="Event date"
                label="Publishing Date"
                withAsterisk
                valueFormat = "MM/DD/YYYY HH:mm"
                // value={form.values.publishDate}
                // onChange={(value: Date) =>
                //   form.setFieldValue('publishDate', value)
                // }
                value={datePickerPublish}
                onChange={(value: Date) => datePickerOnChangePublish(value)}
                minDate={new Date()}
                size="sm"
              />
              <DateTimePicker
                placeholder="Event date"
                label="Deadline     "
                withAsterisk
                valueFormat = "MM/DD/YYYY HH:mm"
                value={datePickerDeadline}
                onChange={(value: Date) => datePickerOnChangeDeadline(value)}
                minDate={datePickerPublish as Date}
                size="sm"

              />
            </Stack>
          </Grid.Col>
        </Grid>
        <Text ta="center" fz="xl" fw={700}>
          Scoring Criteria
        </Text>
        <Paper
          p="lg"
          radius="md"
          withBorder
          sx={{
            padding: 10,
            marginTop: 10,
            marginBottom: 10,
            marginRight: 33,
            marginLeft: 50,
          }}
        >
          {scoringCriteriaFields}
          <Button
            data-cy="add"
            onClick={() => {
              scoringForm.insertListItem('scoringCriteria', {
                id: '',
                description: '',
              });
            }}
            sx={{ marginLeft: 10 }}
          >
            Add Scoring Criteria
          </Button>
        </Paper>
        <Text ta="center" fz="xl" fw={700}>
          Questions
        </Text>
        <Paper
          p="lg"
          radius="md"
          withBorder
          sx={{
            padding: 10,
            marginTop: 10,
            marginBottom: 10,
            marginRight: 33,
            marginLeft: 50,
          }}
        >
          <DragDropContext
            onDragEnd={({ destination, source }) =>
              form.reorderListItem('questions', {
                from: source.index,
                to: destination ? destination.index : 0,
              })
            }
          >
            {showUIElements && (
              <Droppable droppableId="dnd-list" direction="vertical">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {fields}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </DragDropContext>
          <Button
            data-cy="add"
            onClick={() => {
              form.insertListItem('questions', {
                id: '',
                applicationId: '',
                value: '',
                isRequired: true,
                type: 'TEXT_IN',
              });
            }}
            sx={{ marginLeft: 10 }}
          >
            Add Question
          </Button>
        </Paper>
      </ScrollArea>
    </>
  );
};

export default EditCreateApplication;
