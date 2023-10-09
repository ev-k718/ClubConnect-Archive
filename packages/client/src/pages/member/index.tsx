import withValidateMembership from '@/HOC/withValidateMembership';
import ClubSelectorCard from '@/components/ClubSelectorCard';
import useAuth from '@/hooks/useAuth';
import AdminLayout from '@/layouts/adminLayout';
import { Col, Flex, Grid, SimpleGrid } from '@mantine/core';
import { Container } from '@mantine/core';
import { Space } from '@mantine/core';
import { Center } from '@mantine/core';
import { createStyles } from '@mantine/core';
import { Title } from '@mantine/core';
import { Text } from '@mantine/core';
import { Button, LoadingOverlay } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { useState } from 'react';
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

const getAllClubsFromUserFn = async (token: string) => {
  const res = await axios({
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/getClubsOwnedAndMemberOf`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

const getAllClubsFromUser = () => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return useQuery({
    queryKey: ['getAllClubsFromUser'],
    queryFn: () => getAllClubsFromUserFn(token),
    enabled: !!token,
  });
};

const AdminHomePage: NextPageWithLayout = () => {
  const { classes } = useStyles();
  const { data: memberships, isError, isLoading } = getAllClubsFromUser();

  if (isError) {
    return <>Error</>;
  }
  if (isLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />
  }

  let clubsOwnedCards = [];
  let clubsMemberCards = [];

  clubsOwnedCards = memberships.clubsOwned.map((club: any) => {
    return (
      <Col span={4}>
        <ClubSelectorCard
          key={`${club.id}-club-owner`}
          id={club.id}
          memberType={'Owner'}
        />
      </Col>
    );
  });

  clubsMemberCards = memberships.clubMemberships.map((clubMembership: any) => {
    return (
      <Col span={4}>
        <ClubSelectorCard
          key={`${clubMembership.clubId}-club-membership`}
          id={clubMembership.clubId}
          memberType={'Member'}
        />
      </Col>
    );
  });

  if (clubsOwnedCards.length === 0 && clubsMemberCards.length === 0) {
    return (
      <Center>
        <SimpleGrid cols={1}>
          <Space h="lg" />
          <Center>
            <h1>You're not in any clubs!</h1>
          </Center>
          <Center>
            <Link href="/applicant">
              <Button radius="lg" style={{ flex: 1 }}>
                Browse all clubs
              </Button>
            </Link>
          </Center>
        </SimpleGrid>
      </Center>
    );
  } else {
    return (
      <>
        <Container size="xl" py="xl">
          <Title order={2} className={classes.title} ta="center" mt="xl">
            Your Clubs
          </Title>

          <Text c="dimmed" className={classes.description} ta="center" mt="md">
            Select a club to view as a member or owner!
          </Text>
          <Flex direction="column" py="sm" rowGap="md">
            <Title order={3}>Clubs Owned:</Title>
            <Grid align="center">{clubsOwnedCards}</Grid>
            <Title order={3}> Club Memberships</Title>
            <Grid align="center">{clubsMemberCards}</Grid>
          </Flex>
        </Container>
      </>
    );
  }
};

AdminHomePage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminHomePage;
