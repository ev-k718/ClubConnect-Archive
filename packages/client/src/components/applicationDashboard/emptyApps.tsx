import { Button, Center, Container, Text } from '@mantine/core';
import { createStyles } from '@mantine/core';
import Link from 'next/link';

import WelcomeUser from '../welcomeUser';

const EmptyApps = () => {
  return (
    <>
      <Container size={620} my={200}>
        <WelcomeUser />
        <Text color="black" size="lg" align="center" mt={5} weight="500" italic>
          You have no open applications.
        </Text>
        <Center>
          <Link href="/applicant">
            <Button mt="xl">Browse clubs here!</Button>
          </Link>
        </Center>
      </Container>
    </>
  );
};

export default EmptyApps;
