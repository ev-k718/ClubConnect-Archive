import useAuth from '@/hooks/useAuth';
import {
  Center,
  Container,
  Grid,
  Group,
  RingProgress,
  Space,
  Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

import ScoreInputCard from './scoreInputCard';

ChartJS.register(
  RadialLinearScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
);

type SingleScore = {
  scoringCriteriaId: string;
  score: number;
};

const getOwnUserInfoFn = async (token: string) => {
  const res = await axios({
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/getOwnUserInfo`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

const getOwnUserInfo = () => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return useQuery({
    queryKey: ['getOwnUserInfo'],
    queryFn: () => getOwnUserInfoFn(token),
    enabled: !!token,
  });
};

export const ScoresView = (props: {
  averageScores: SingleScore[];
  submissionId: string;
  criteria: any[];
  scores: any[];
  applicationId: string;
}) => {
  const { data: userId, isLoading, isError } = getOwnUserInfo();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error</div>;
  }

  const mappedCriteria: any = {};
  props.criteria.forEach((obj) => {
    mappedCriteria[obj.id] = obj.description;
  });

  const scoresDisp = Object.keys(mappedCriteria).map((key, index) => {
    //you now have the category key
    //use the key to find personal score, then average score
    const yourScore = props.scores.find(
      (score) => score.scoringCriteriaId === key && score.userId === userId,
    );
    const averageScore = props.averageScores.find(
      (score) => score.scoringCriteriaId === key,
    );
    //conditionally render those based on null values
    // const thisCategory = props.scores.find((score) => score.scoringCriteriaId === key && score.userId === userId) ? (
    //   props.scores.find((score) => score.scoringCriteriaId === key && score.userId === userId))
    //     :
    //     null;

    // const thisAverageScore = (
    //   props.averageScores.find((score) => score.scoringCriteriaId === key) as SingleScore).score ? (
    //     props.averageScores.find((score) => score.scoringCriteriaId === key) as SingleScore).score : 0;
    // ;

    const thisAverageScore = averageScore ? averageScore.score : 0;
    return (
      <>
        <Grid.Col span={4}>
          <Center>
            <Text fw={700}>{mappedCriteria[key]}</Text>
          </Center>
        </Grid.Col>
        <Grid.Col span={4}>
          <Center>
            <RingProgress
              size={70}
              roundCaps
              thickness={8}
              sections={[{ value: thisAverageScore * 10, color: 'blue' }]}
              label={<Center>{thisAverageScore}</Center>}
            />
          </Center>
        </Grid.Col>
        <Grid.Col span={4}>
          <Center>
            {yourScore ? (
              <ScoreInputCard
                key={`${yourScore.id}-initialized`}
                applicationSubmissionId={props.submissionId}
                criteriaName={mappedCriteria[key]}
                score={yourScore.score}
                scoringId={yourScore.id}
                scoringCriteriaId={key}
                applicationId={props.applicationId}
                initialized={true}
              />
            ) : (
              <ScoreInputCard
                key={`${mappedCriteria[key].id}-uninitialized`}
                applicationSubmissionId={props.submissionId}
                criteriaName={mappedCriteria[key]}
                score={0}
                scoringId={mappedCriteria[key].id}
                scoringCriteriaId={key}
                applicationId={props.applicationId}
                initialized={false}
              />
            )}
          </Center>
        </Grid.Col>
      </>
    );
  });

  //TODO: add configs for the radar chart
  let radarData: any = [];
  let radarLabels: any = [];
  const sortedAveragesScores = props.averageScores.sort((a, b) =>
    a.scoringCriteriaId > b.scoringCriteriaId ? 1 : -1,
  );
  sortedAveragesScores.forEach((score) => {
    radarData.push(score.score);
    radarLabels.push(mappedCriteria[score.scoringCriteriaId]);
  });

  const chartData = {
    labels: radarLabels,
    datasets: [
      {
        data: radarData,
        borderColor: 'rgba(34,139,230,1)',
        backgroundColor: 'rgba(34,139,230,.5)',
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 10,
      },
    },
  };

  return (
    <>
      <Group position="center" px="lg">
        <Grid align="center" justify="space-between">
          <Grid.Col span={4}>
            <Center>
              <Text td="underline" fw={700}>
                Criteria
              </Text>
            </Center>
          </Grid.Col>
          <Grid.Col span={4}>
            <Center>
              <Text td="underline" fw={700}>
                Average Score
              </Text>
            </Center>
          </Grid.Col>
          <Grid.Col span={4}>
            <Center>
              <Text td="underline" fw={700}>
                Your Score
              </Text>
            </Center>
          </Grid.Col>
          {scoresDisp}
        </Grid>

        <Radar data={chartData} options={chartOptions} />
      </Group>
    </>
  );
};
