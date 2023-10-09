//@ts-nocheck
import {
  Button,
  FileInput,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Question } from 'types/dbTypes';
import { IconUpload } from '@tabler/icons-react';

type Information = {
  name: string;
  description: string;
  questions: Question[];
  publishDate: Date;
  deadlineDate: Date;
};

type Props = {
  doesExist: boolean;
  modalInfo: Information;
};

const PreviewApplication = ({ doesExist, modalInfo }: Props) => {
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      publishDate: new Date(),
      deadlineDate: new Date(),
      questions: [
        {
          id: '',
          value: '',
          applicationId: '',
          type: 'TEXT_IN',
          isRequired: false,
        },
      ],
    },
  });

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  useEffect(() => {
    if (doesExist) {
      form.setFieldValue('name', modalInfo.name);
      form.setFieldValue('description', modalInfo.description);
      form.setFieldValue('publishDate', modalInfo.publishDate);
      form.setFieldValue('deadlineDate', modalInfo.deadlineDate);
      form.setFieldValue('questions', modalInfo.questions);
    }
  });

  const [showUIElements, setShowUIElements] = React.useState(false);
  useEffect(() => {
    setShowUIElements(true);
  }, []);


  const fields = form.values.questions.map((question, index) => (
    <Draggable
      key={index.toString()}
      index={index}
      draggableId={index.toString()}
    >
      {(provided, snapshot) => (
        <Paper
          p="lg"
          radius="md"
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{ padding: 10 }}
          data-cy="q"
        >
          <Stack>
            <Grid>
              <Grid.Col xs={12}>
                {question.type === 'TEXT_IN' ? (
                  <TextInput
                    label={question.value}
                    withAsterisk={question.isRequired}
                  />
                ) : (
                  <FileInput
                    placeholder="Pick file"
                    label={question.value}
                    withAsterisk={question.isRequired}
                    icon={<IconUpload size={14} />}
                    accept="application/pdf"
                  />
                )}
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>
      )}
    </Draggable>
  ));

  // The below preview will be placed in the modal
  return (
    <>
      <Text ta="center" fz="xl" fw={700}>
        {form.values.name}
      </Text>
      <Text ta="center" fz="md" fw={400}>
        {form.values.description}
      </Text>
      <Text ta="center" fz="xs" fw={400} sx={{ paddingTop: 5 }}>
        {`Application Opened: ${form.values.publishDate.toLocaleDateString(
          'en-us',
          dateTimeOptions,
        )}`}
      </Text>
      <Text ta="center" fz="xs" fw={400} color="red">
        {`Application Closes: ${form.values.deadlineDate.toLocaleDateString(
          'en-us',
          dateTimeOptions,
        )}`}
      </Text>
      <Paper p="lg" radius="md" sx={{ paddingLeft: 0, paddingRight: 0 }}>
        <DragDropContext
          onDragEnd={({ destination, source }) =>
            form.reorderListItem('questions', {
              from: source.index,
              to: destination!.index,
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
      </Paper>
      {/* <Group position="right" mt="md">
        <Button type="submit">Submit Application</Button>
      </Group> */}
    </>
  );
};

export default PreviewApplication;
