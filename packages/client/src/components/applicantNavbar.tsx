import useAuth from '@/hooks/useAuth';
import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  Header,
  ScrollArea,
  Title,
  createStyles,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  //TODO: Add more styling to allow for underlining of the active link
  link: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontWeight: 600,
    fontSize: theme.fontSizes.md,

    [theme.fn.smallerThan('sm')]: {
      height: 42,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
    }),
  },

  button: {
    fontWeight: 700,
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

const ApplicantNavBar = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { classes, theme } = useStyles();
  const { logout } = useAuth();

  return (
    <Box>
      <Header height={110} px="md" withBorder={true}>
        <Group position="apart" sx={{ height: '100%' }}>
          <Flex direction={'column'}>
            {/* TODO: Figure out how to change the color of connect to blue*/}
            <Title>ClubConnect</Title>
          </Flex>
          <Group
            sx={{ height: '100%' }}
            position="right"
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link href="/applicant" className={classes.link}>
              All Clubs
            </Link>
            <Link
              href="/applicant/application-dashboard"
              className={classes.link}
            >
              My Applications
            </Link>
            <Link href="/member" className={classes.link}>
              My Clubs
            </Link>
            <Button onClick={logout} className={classes.button}>
              Sign Out
            </Button>
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
          />
        </Group>
      </Header>

      {/* Below for the mobile view */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="ClubConnect"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea sx={{ height: 'calc(100vh - 60px)' }} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
          />
          <a href="#" className={classes.link}>
            All Clubs
          </a>
          <a href="#" className={classes.link}>
            My Applications
          </a>
          <Link href="/member" className={classes.link}>
            My Clubs
          </Link>

          <Divider
            my="sm"
            color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
          />

          <Group position="center" grow pb="xl" px="md">
            <Button>Log Out</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default ApplicantNavBar;
