import loginImage from '@/../assets/images/LoginImage.jpeg';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, Flex, Text, useMantineTheme, LoadingOverlay } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import router from 'next/router';

const SignIn = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />
  }

  if (user) {
    router.push('/applicant');
    return;
  }

  const theme = useMantineTheme();
  return (
    <Flex w="100%" direction="row" h="100vh">
      <Flex bg="blue" w="50%" pos="relative">
        <Image
          src={loginImage}
          style={{
            objectFit: 'cover',
          }}
          alt="Login Page Image"
          fill
        />
      </Flex>
      <Flex direction="column" align="center" justify="center" h="100%" w="50%">
        <Text fz={60} fw="bolder">
          <Text span>Club</Text>
          <Text span color={theme.other.primary_blue}>
            Connect
          </Text>
        </Text>

        <Text color={theme.other.custom_gray}>@ Johns Hopkins University</Text>
        {user ? (
          <>
            <Link href="/api/auth/logout">
              <Button mt={20} color="white" bg={theme.other.primary_blue}>
                Sign Out
              </Button>
            </Link>
          </>
        ) : (
          <Link href="/api/auth/login">
            <Button mt={20} color="white" bg={theme.other.primary_blue}>
              Sign In
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default SignIn;
