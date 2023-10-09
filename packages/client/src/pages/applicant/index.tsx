import ClubCard from '@/components/clubDashboard/ClubCard';
import useAuth from '@/hooks/useAuth';
import UserLayout from '@/layouts/userLayout';
import {
  Container,
  SimpleGrid,
  Text,
  Title,
  createStyles,
  LoadingOverlay
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ReactElement } from 'react';
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

const fetchClubs = async (token: string) => {
  const res = await axios({
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/club/`,

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

const fetchAuthThenRest = () => {
  //get token from auth0; need it as a header when making a http request
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return useQuery({
    queryKey: ['clubDashboard'],
    queryFn: () => fetchClubs(token),
    enabled: !!token,
  });
};

const ClubDashboard: NextPageWithLayout = () => {
  const { classes, theme } = useStyles();

  const { data, isLoading, isError } = fetchAuthThenRest();

  if (isLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />
  }

  if (isError) {
    return <>Error</>;
  }

  return (
    <Container size="xl" py="xl">
      <Title order={2} className={classes.title} ta="center" mt="xl">
        All Clubs
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Browse all clubs or just the ones that are recruiting
      </Text>

      <SimpleGrid
        cols={3}
        spacing="lg"
        mt={50}
        breakpoints={[{ maxWidth: 'md', cols: 1 }]}
      >
        {data.map((club: any) => (
          <ClubCard
            key={club.id}
            id={club.id}
            name={club.name}
            membersLength={club.members.length}
            cycle={
              club.clubProfile
                ? club.clubProfile.applicationCycleDescription
                : 'Not specified'
            }
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};

ClubDashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default ClubDashboard;
