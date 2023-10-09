import useAuth from '@/hooks/useAuth';
import {
  Button,
  Card,
  Center,
  Group,
  Space,
  Text,
  Title,
  createStyles,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import nest from '@/../assets/images/nest.jpeg';
import alevel from '@/../assets/images/alevel.jpeg';
import salant from '@/../assets/images/salant.jpeg';
import swec from '@/../assets/images/swec.png';
import notfound from '@/../assets/images/notfound.jpg';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  imageSection: {
    padding: theme.spacing.xs,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: `${'rem'} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  section: {
    padding: theme.spacing.md,
    borderTop: `${'0rem'} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

type Props = {
  id: string;
  memberType: 'Owner' | 'Member';
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

const ClubSelectorCard = ({ id, memberType }: Props) => {
  const { classes, theme } = useStyles();
  const { data, isLoading, isError } = getClubNameFromClubID(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const nestId = "clgk1s9vm0000wxqskdkwgg6y";
  const alevelId = "clh0vp4ra0002wx0y577z2mlb";
  const salantId = "clh0vnzdi0000wx0y19eqyk0u";
  const swecId = "clgvajhq80000wx8trmsktg90";

  let srcImg = notfound;

  if (id.toString() === nestId) {
    srcImg = nest;
  } else if (id.toString() === alevelId) {
    srcImg = alevel;
  } else if (id.toString() === salantId) {
    srcImg = salant;
  } else if (id.toString() === swecId) {
    srcImg = swec;
  }

  //TODO: change routing of the buttons to point to the right club when all applictions is built
  return (
    <Card withBorder radius="xl" className={classes.card} h="100%">
      <Card.Section className={classes.imageSection}>
        <Image
          src={srcImg}
          alt = {"club logo"}
          height = {170}
        />
      </Card.Section>

      <Group position="center" mt="lg">
        <div>
          <Text fw={700} fz="xl">
            {data.name}
          </Text>
          <Center>
            <Text>{memberType}</Text>
          </Center>
        </div>
      </Group>
      <Space />
      <Group position="center" mt="sm" spacing="xl">
        <div>
          <Link href={`/member/${id}/applications`}>
            <Button radius="md" style={{ flex: 1 }}>
              View Applications
            </Button>
          </Link>
        </div>
      </Group>
      <Group position="center" mt="sm" spacing="xl">
        {memberType === 'Owner' ? (
          <Link href={`/member/${id}`}>
            <Button radius="md" style={{ flex: 1 }}>
              Edit Profile
            </Button>
          </Link>
        ) : (
          <></>
        )}
      </Group>

      <Card.Section className={classes.section}>
        <Group spacing={10}></Group>
      </Card.Section>
    </Card>
  );
};

export default ClubSelectorCard;
