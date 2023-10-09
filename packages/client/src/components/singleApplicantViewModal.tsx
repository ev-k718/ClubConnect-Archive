import useAuth from '@/hooks/useAuth';
import {
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  Space,
  Stack,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

import AnswersView from './answersView';
import { CommentsView } from './commentsView';
import { ScoresView } from './scoresView';

type SingleScore = {
  scoringCriteriaId: string;
  score: number;
};

type RowData = {
  submissionId: string;
  applicantId: string;
  applicationId: string;
  averageScores: SingleScore[];
  overallAverageScore: number;
  answers: any[];
  questions: any[];
  comments: any[];
  criteria: any[];
  scores: any[];
};

export function SingleApplicantViewModal(props: { rowData: RowData }) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Flex>
        <Group position="center">
          <Button onClick={open}>View</Button>
        </Group>
      </Flex>
      <Modal opened={opened} onClose={close} size='95%'>
        <Grid>
          <Grid.Col span={8}>
            <Stack>
              <Center>
                <Title order={2} color="blue">
                  Scores
                </Title>
              </Center>

              <ScoresView
                applicationId={props.rowData.applicationId}
                scores={props.rowData.scores}
                averageScores={props.rowData.averageScores}
                criteria={props.rowData.criteria}
                submissionId={props.rowData.submissionId}
              />
    
              <Divider />

              <Center>
                <Title order={2} color="blue">
                  Answers
                </Title>
              </Center>
              <AnswersView
                answers={props.rowData.answers}
                questions={props.rowData.questions}
              />
            </Stack>
          </Grid.Col>

          <Divider orientation="vertical" />

          <Grid.Col span={3}>
            <Center>
              <Title order={2} color="blue" ml={90}>
                Comments
              </Title>
            </Center>
            <CommentsView
              comments={props.rowData.comments}
              applicationSubmissionId={props.rowData.submissionId}
              applicationId={props.rowData.applicationId}
              key={props.rowData.submissionId}
            />
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
}
