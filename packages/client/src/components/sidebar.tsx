import {
  Burger,
  Collapse,
  Group,
  Navbar,
  Text,
  Title,
  createStyles,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NextPage } from 'next';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { NextPageWithLayout } from 'types/layout';

const useStyles = createStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xs})`,
    borderBottom: ` solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.xl,
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[9],
    padding: `${theme.spacing.xl} ${theme.spacing.xl}`,
    borderRadius: theme.radius.xl,
    fontWeight: 600,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
    },
  },
}));

const data = [
  { link: '', label: 'Notifications' },
  { link: '', label: 'My Applications' },
  { link: '', label: 'Starred Clubs' },
  { link: '', label: 'Club Search' },
  { link: '', label: 'Account' },
  { link: '', label: 'Log Out' },
];

const SideBar = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const label = opened ? 'Close navigation' : 'Open navigation';
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(data[0]?.label);

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <span>{item.label}</span>
    </a>
  ));
  return (
    <>
      <Burger
        opened={opened}
        onClick={toggle}
        aria-label={label}
        size="md"
        title="Open sidebar"
        p="xl"
      />

      <Collapse in={opened}>
        <Navbar height={700} width={{ sm: 300 }} p="lg">
          <Navbar.Section grow>
            <Group className={classes.header} position="apart">
              <Title order={1}>ClubConnect</Title>
              <Text weight={400}>Welcome, Evan!</Text>
            </Group>
            {links}
          </Navbar.Section>
        </Navbar>
      </Collapse>
    </>
  );
};

export default SideBar;
