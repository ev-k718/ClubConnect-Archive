import ApplicationSubmissionModal from '@/components/applicationSubmissionModal';
import Filedrop from '@/components/fileDrop';
import useAuth from '@/hooks/useAuth';
import useNavigationLock from '@/hooks/useNavigationLock';
import UserLayout from '@/layouts/userLayout';
import {
  Button,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  LoadingOverlay
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck, IconUpload } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ReactElement, SetStateAction, useEffect, useState } from 'react';
import { NextPageWithLayout } from 'types/layout';

type Answer = {
  type: string;
  questionId: string;
  value: string;
  filename?: string;
};

type Question = {
  id: string;
  value: string;
  type: string;
  isRequired: boolean;
};

export type AppSubmissionFormType = {
  name: string;
  description: string;
  publishDate: string;
  deadlineDate: string;
  questions: Record<string, Question>;
  answers: Record<string, Answer>;
  submitted: boolean;
};

const ApplicationSubmission: NextPageWithLayout = () => {
  const router = useRouter();
  const { appSubmissionId } = router.query;
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  const queryClient = useQueryClient();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [questionsWithoutFileInput, setQuestionsWithoutFileInput] = useState<
    string[]
  >([]);

  //Checks for unsaved changes before leaving page
  useNavigationLock(unsavedChanges);

  const form = useForm<AppSubmissionFormType>({
    initialValues: {
      name: '',
      description: '',
      publishDate: '',
      deadlineDate: '',
      questions: {},
      answers: {},
      submitted: false,
    },
    validateInputOnChange: true,

    validate: (values) => {
      const errors: Partial<Record<keyof AppSubmissionFormType, any>> = {};

      // Loop through the answers
      Object.entries(values.answers).forEach(([answerId, answer]) => {
        const question = values.questions[answer.questionId];

        if (question && question.isRequired) {
          if (answer.type === 'TEXT_IN' && answer.value.trim() === '') {
            if (!errors.answers) {
              errors.answers = {};
            }
            errors.answers[answerId] = "This is a required field";
          } else if (
            answer.type === 'FILE_UPLOAD' &&
            (answer.filename === undefined || answer.filename === '')
          ) {
            if (!errors.answers) {
              errors.answers = {};
            }
            errors.answers[answerId] = "If you have uploaded a file please save changes, otherwise please upload a file and save changes";
          }
        }
      });
      return errors;
    },
  });

  const fetchApplicationSubmission = async (id: string) => {
    const res = await axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/applicationSubmission/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const fetchApplicationSubmissionQuery = (id: string) => {
    return useQuery({
      queryKey: ['getApplicationSubmission', id],
      queryFn: async () => fetchApplicationSubmission(id),
      enabled: !!token,
      refetchOnWindowFocus: false, // Done to prevent refetch if person tries to leave page as it resets their answers otherwise

      onSuccess: ({ data: applicationSubmission }: any) => {
        let questions = applicationSubmission.application.questions.reduce(
          (acc: Record<string, Question>, cur: Question) => {
            acc[cur.id] = {
              id: cur.id,
              value: cur.value,
              type: cur.type,
              isRequired: cur.isRequired,
            };
            return acc;
          },
          {},
        );
        let submitted =
          applicationSubmission.status === 'SUBMITTED' ? true : false;

        const answerValues = applicationSubmission.answers.reduce(
          (acc: Record<string, Answer>, cur: Answer) => {
            acc[cur.questionId] = {
              type: cur.type,
              questionId: cur.questionId,
              value: cur.value,
              filename: cur?.filename,
            };
            return acc;
          },
          {},
        );

        const answers: Record<string, Answer> =
          applicationSubmission.application.questions.reduce(
            (acc: Record<string, Answer>, cur: Question) => {
              const answer = answerValues[cur.id];
              acc[cur.id] = {
                type: cur.type,
                questionId: cur.id,
                value: answer?.value || '',
                filename: answer?.filename || '',
              };
              return acc;
            },
            {},
          );

        const newQuestionsWithoutFileInput: string[] = [];
        for (const question of applicationSubmission.application.questions) {
          if (question.type === 'TEXT_IN') {
            newQuestionsWithoutFileInput.push(question.id);
          }
        }
        setQuestionsWithoutFileInput(newQuestionsWithoutFileInput);

        const dateTimeOptions: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZoneName: 'short',
          hour: 'numeric',
          minute: 'numeric',
        };

        form.setValues({
          name: applicationSubmission.application.name,
          description: applicationSubmission.application.description,
          publishDate: new Date(
            applicationSubmission.application.openDate,
          ).toLocaleDateString('en-us', dateTimeOptions),
          deadlineDate: new Date(
            applicationSubmission.application.deadline,
          ).toLocaleDateString('en-us', dateTimeOptions),
          questions: questions,
          answers: answers,
          submitted: submitted,
        });
      },
    });
  };

  const saveChanges = useMutation({
    mutationFn: async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      //only send answers that are not file inputs
      const answers: Partial<Answer>[] = [];
      for (const answer of Object.values(form.values.answers)) {
        if (questionsWithoutFileInput.includes(answer.questionId)) {
          answers.push({ questionId: answer.questionId, value: answer.value });
        }
      }

      return axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applicationSubmission/${appSubmissionId}/answers`,
        {
          answers: answers,
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
      showNotification({
        message: 'Your changes have been saved',
        icon: <IconCheck size={16} />,
      });
      setUnsavedChanges(false);
    },
    onError: () => {
      showNotification({
        message: 'Error saving changes',
        icon: <IconAlertTriangle size={16} />,
        color: 'red',
      });
    },
  });

  const { isLoading, isError } = fetchApplicationSubmissionQuery(
    appSubmissionId as string,
  );
  if (isLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />
  }
  if (isError) {
    return <div>Error</div>;
  }

  const fields = () => {
    return Object.values(form.values.questions).map((question, index) => (
      <Paper p="lg" radius="md" sx={{ padding: 10 }} data-cy="q" key={index}>
        <Stack>
          <Grid>
            <Grid.Col xs={12}>
              {question.type === 'TEXT_IN' ? (
                <TextInput
                  label={question.value}
                  withAsterisk={question.isRequired}
                  {...form.getInputProps(`answers.${question.id}.value`)}
                  value={form.values.answers[question.id]?.value}
                  onChange={(e) => {
                    e.preventDefault();
                    form.setFieldValue(
                      `answers.${question.id}.value`,
                      e.target.value,
                    );
                    setUnsavedChanges(true);
                    form.clearErrors()
                  }}
                  disabled={form.values.submitted}
                  error={form.errors.answers?.[question.id as keyof typeof form.errors.answers]}
                  
                />
              ) : (
                <Filedrop
                  question={question}
                  form={form}
                  id={question.id}
                  setUnsavedChanges={setUnsavedChanges}
                  token={token}
                  appSubmissionId={appSubmissionId as string}
                  questionId={question.id}
                />
              )}
            </Grid.Col>
          </Grid>
        </Stack>
      </Paper>
    ));
  };

  return (
    <>
      <ApplicationSubmissionModal
        appSubmissionId={appSubmissionId as string}
        opened={opened}
        close={close}
        saveChanges={saveChanges.mutateAsync}
      />
      <ScrollArea offsetScrollbars sx={{ padding: 100 }}>
        <Title order={2} ta="center">
          {form.values.name}
        </Title>
        <Text ta="center" fz="md" fw={400}>
          {form.values.description}
        </Text>
        <Text ta="center" fz="xs" fw={400} sx={{ paddingTop: 5 }}>
          {`Application Opened: ${form.values.publishDate}`}
        </Text>
        <Text ta="center" fz="xs" fw={400} color="red">
          {`Application Closes: ${form.values.deadlineDate}`}
        </Text>
        <Paper p="lg" radius="md" sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <div>{fields()}</div>
        </Paper>
        {!form.values.submitted && (
          <Group position="right" mt="md" sx={{ marginRight: 38 }}>
            <Button
              type="submit"
              variant="outline"
              onClick={async (e) => {
                await saveChanges.mutateAsync(e);
              }}
            >
              Save Changes
            </Button>
            <Button
              type="submit"
              onClick={() => {
                form.validate();
                if (form.isValid()) {
                  open();
                }
              }}
            >
              Submit Application
            </Button>
          </Group>
        )}
      </ScrollArea>
    </>
  );
};

ApplicationSubmission.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout> {page} </UserLayout>;
};

export default ApplicationSubmission;
