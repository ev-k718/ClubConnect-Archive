//@ts-nocheck
import useAuth from '@/hooks/useAuth';
import { Button, Grid, ScrollArea, Text } from '@mantine/core';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const AnswersView = (props: { answers: any; questions: any }) => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  const [answersRows, setAnswersRows] = useState<[] | null>(null);

  const fetchFileFromAws = async (fileHash: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/s3FileStorage/getFile`,
      {
        params: {
          key: fileHash,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return res.data;
  };

  const createAnswerRows = (answersMap) => {
    const answersRows: any[] = props.questions.map((question: any, index) => {
      const answer = answersMap.get(question.id);
      if (!answer || answer.value.trim() === '') {
        return (
          <Grid.Col span={1} key={index}>
            <h4>{question.value}</h4>
            <Text>No answer provided</Text>
          </Grid.Col>
        );
      } else {
        if (question.type === 'FILE_UPLOAD' && answer.filename) {
          return (
            <Grid.Col span={1} key={index}>
              <h4>{question.value}</h4>
              <Link href={answer.link} target="_blank">
                <Button variant="light">{answer.filename}</Button>
              </Link>
            </Grid.Col>
          );
        } else {
          return (
            <Grid.Col span={1} key={index}>
              <h4>{question.value}</h4>
              <Text>{answer.value}</Text>
            </Grid.Col>
          );
        }
      }
    });
    return answersRows;
  };

  useEffect(() => {
    const createMap = async () => {
      const answersMap = new Map();
      for (const answer of props.answers) {
        if (answer.filename) {
          const { fileUrl } = await fetchFileFromAws(answer.value);
          answersMap.set(answer.questionId, { ...answer, link: fileUrl });
        } else {
          answersMap.set(answer.questionId, answer);
        }
      }
      return answersMap;
    };

    createMap()
      .then((answersMap) => {
        setAnswersRows(createAnswerRows(answersMap));
      })
      .catch((err) => {
        console.log(err);
        //TODO: CHANGE THIS ERR
      });

    return () => {};
  }, []);

  if (!answersRows) {
    return <>Loading...</>;
  }

  return (
    <>
        <Grid columns={1} px="lg">
          {answersRows}
        </Grid>
    </>
  );
};

export default AnswersView;
