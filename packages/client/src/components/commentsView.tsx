// @ts-nocheck
import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  ScrollArea,
  SimpleGrid,
  Space,
  Text,
} from '@mantine/core';

import AddCommentModal from './addCommentModal';

type Comment = {
  id: string;
  applicationSubmissionId: string;
  userId: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export const CommentsView = (props: {
  comments: Comment[];
  applicationSubmissionId: string;
  applicationId: string;
}) => {
  const marginLeft = 90;
  const commentRows = props.comments.map((comment, key) => {
    return (
      <Grid.Col key={key} span={1}>
        <Box>
          <Text>"{comment.value}"</Text>
          <Text weight={500}>-{comment.user.name}</Text>
        </Box>
      </Grid.Col>
    );
  });

  return props.comments.length > 0 ? (
    <>
      <Container px="lg" py="xl" ml={marginLeft}>
        <AddCommentModal
          applicationSubmissionId={props.applicationSubmissionId}
          applicationId={props.applicationId}
        />
      </Container>
      <Grid columns={1} px="lg" ml={marginLeft / 4}>
        {commentRows.reverse()}
      </Grid>
    </>
  ) : (
    <>
      <Container px="lg" ml={marginLeft}>
        <AddCommentModal
          applicationSubmissionId={props.applicationSubmissionId}
          applicationId={props.applicationId}
        />
        <Box >
        <Text align="cener" weight={500} mt = {25} ml={10}>No comments yet</Text>
        </Box>
      </Container>
    </>
  );
};
