import withValidateMembership from '@/HOC/withValidateMembership';
import Spreadsheet from '@/components/spreadsheet';
import useAuth from '@/hooks/useAuth';
import AdminLayout from '@/layouts/adminLayout';
import { Container, Text, Title, createStyles, LoadingOverlay } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import { NextPageWithLayout } from 'types/layout';

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,

    [theme.fn.smallerThan('sm')]: {
      fontSize: '2.4rem',
    },
  },

  description: {
    maxWidth: 600,
    margin: 'auto',

    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: '4.5rem',
      height: '0.2rem',
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },

  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: '-0.025rem',
    textTransform: 'uppercase',
  },

  icon: {
    marginRight: '0.5rem',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
}));

type Props = {};

type SingleScore = {
  scoringCriteriaId: string;
  score: number;
};

type RowData = {
  submissionId: string;
  applicantId: string;
  applicationId: string;
  averageScores: SingleScore[];
  questions: any;
  answers: any;
  comments: any;
  criteria: any;
  scores: any;
  overallAverageScore: number;
  numComments: number;
  name: string;
  email: string;
};

const calcOverallAverageScore = (scores: SingleScore[]) => {
  let total = 0;
  scores.forEach((score) => {
    total += score.score;
  });
  return Math.round((total / scores.length) * 10) / 10;
};

const calcAverageScoresForOne = (scores: any) => {
  const flattenedArray = scores.flatMap((score: any) => {
    return { scoringCriteriaId: score.scoringCriteriaId, score: score.score };
  });

  const averages = flattenedArray.reduce((acc: any, score: SingleScore) => {
    if (!acc[score.scoringCriteriaId]) {
      acc[score.scoringCriteriaId] = { total: 0, count: 0 };
    }

    acc[score.scoringCriteriaId].total += score.score;
    acc[score.scoringCriteriaId].count++;
    return acc;
  }, {});

  const finalAverages: any = [];
  Object.keys(averages).forEach((scoringCriteriaId) => {
    const { total, count } = averages[scoringCriteriaId];
    const average = Math.round((total / count) * 10) / 10;
    finalAverages.push({
      scoringCriteriaId: scoringCriteriaId,
      score: average,
    });
  });
  return finalAverages;
};

const getAllCompleteSubmissionsFromApplicationFn = async (
  token: string,
  applicationId: string,
) => {
  const res = await axios({
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/applicationSubmission/getCompletedSubmissionForApplication/${applicationId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

const getAllCompleteSubmissionsFromApplication = (applicationId: string) => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return useQuery({
    queryKey: ['getAllCompleteSubmissionsFromApplication', applicationId],
    queryFn: () =>
      getAllCompleteSubmissionsFromApplicationFn(token, applicationId),
    enabled: !!token,
  });
};

const getApplicationInfoFromApplicationIdFn = async (
  token: string,
  applicationId: string,
) => {
  const res = await axios({
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/application/${applicationId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

const getApplicationInfoFromApplicationId = (applicationId: string) => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return useQuery({
    queryKey: ['getApplicationInfoFromApplicationId', applicationId],
    queryFn: () => getApplicationInfoFromApplicationIdFn(token, applicationId),
    enabled: !!token,
  });
};

const getClubNameFromClubIDFn = async (token: string, clubId: string) => {
  const res = await axios({
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/club/clubName/${clubId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

const getClubNameFromClubID = (clubId: string) => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return useQuery({
    queryKey: ['getClubNameFromClubID', clubId],
    queryFn: () => getClubNameFromClubIDFn(token, clubId),
    enabled: !!token,
  });
};

const allApplicantsPage: NextPageWithLayout = (props: Props) => {
  const router = useRouter();
  const { clubId, applicationId } = router.query;
  const { classes } = useStyles();

  const { data, isLoading, isError } = getAllCompleteSubmissionsFromApplication(
    applicationId as string,
  );

  const {
    data: applicationData,
    isLoading: applicationIsLoading,
    isError: applicationIsError,
  } = getApplicationInfoFromApplicationId(applicationId as string);

  const {
    data: clubNameData,
    isLoading: clubNameIsLoading,
    isError: clubNameIsError,
  } = getClubNameFromClubID(clubId as string);

  if (isLoading || applicationIsLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />;
  }

  if (isError || applicationIsError) {
    return <>Error</>;
  }

  const entries: RowData[] = [];
  data.forEach((appSubmission: any) => {
    entries.push({
      submissionId: appSubmission.id as string,
      applicantId: appSubmission.applicantId as string,
      applicationId: applicationId as string,
      averageScores: calcAverageScoresForOne(appSubmission.scores),
      overallAverageScore: calcOverallAverageScore(
        appSubmission.scores,
      ) as number,
      scores: appSubmission.scores as any[],
      answers: appSubmission.answers as any,
      questions: applicationData.questions as any,
      comments: appSubmission.comments as any,
      criteria: applicationData.scoringCriteria as any,
      numComments: appSubmission.comments.length as number,
      name: appSubmission.applicant.name as string,
      email: appSubmission.applicant.email as string,
    });
  });

  return (
    <div>
      <Container size="xl" py="xl">
        <Title order={2} className={classes.title} ta="center" mt="xl">
          {clubNameData.name}
        </Title>
        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          All applicants from {applicationData.name}
        </Text>
      </Container>
      <Container px="xs">
        <Spreadsheet data={entries} />
      </Container>
    </div>
  );
};

allApplicantsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default withValidateMembership(allApplicantsPage, 'membersOnly');
