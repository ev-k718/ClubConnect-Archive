import {
  Button,
  Card,
  Center,
  Group,
  Text,
  createStyles,
} from '@mantine/core';
import Link from 'next/link';
import Image from 'next/image';
import nest from '@/../assets/images/nest.jpeg';
import alevel from '@/../assets/images/alevel.jpeg';
import salant from '@/../assets/images/salant.jpeg';
import swec from '@/../assets/images/swec.png';
import notfound from '@/../assets/images/notfound.jpg';
import { idText } from 'typescript';

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
    padding: theme.spacing.lg,
    borderTop: `${'0rem'} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

type Props = {
  id: number;
  name: string;
  membersLength: number;
  cycle: string;
};

const ClubCard = ({ id, name, membersLength, cycle }: Props) => {
  const { classes, theme } = useStyles();
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


  return (
    <Card withBorder radius="xl" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image
          src={srcImg}
          alt={name}
          height={170}
        />
      </Card.Section>

      <Group position="center" mt="lg">
        <div>
          <Text fw={700} fz="xl">
            {name}
          </Text>
        </div>
      </Group>

      <Group position="apart" mt="sm">
        <div>
          <Text fw={500}>Application Cycle</Text>
          <Text fz="s">{cycle}</Text>
        </div>
        <div>
          <Text fw={500}>Members</Text>
          <Text fz="s">{membersLength}</Text>
        </div>
      </Group>

      <Card.Section className={classes.section}>
        <Center>
          <Link href={`/applicant/${id}`}>
            <Button radius="xl" style={{ flex: 1 }}>
              View full profile
            </Button>
          </Link>
        </Center>
      </Card.Section>
    </Card>  

  );
};

export default ClubCard;
