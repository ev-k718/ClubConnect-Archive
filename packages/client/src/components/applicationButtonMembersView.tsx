import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { Application } from 'types/dbTypes';

type Props = {
  application: Application;
};

const ApplicationButtonMembersView = ({ application }: Props) => {
  const theme = useMantineTheme();

  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return (
    <Paper radius="sm" p="xl" withBorder shadow="md">
      <Group position="apart" align="center">
        <SimpleGrid cols={4} w="100%">
          <Stack spacing="xs" align="flex-start">
            <Text color={theme.other.custom_gray} fw="bold" size="sm">
              Name
            </Text>
            <Text fw="bold" size="md">
              {application.name}
            </Text>
          </Stack>

          <Stack spacing="xs" align="flex-start">
            <Text color={theme.other.custom_gray} fw="bold" size="sm">
              Deadline
            </Text>
            <Text fw="bold" size="md">
              {new Date(application.deadline).toLocaleString(
                'en-US',
                dateTimeOptions,
              )}
            </Text>
          </Stack>
          <Stack spacing="xs" align="flex-start">
            <Text color={theme.other.custom_gray} fw="bold" size="sm">
              Status
            </Text>
            <Text fw="bold" size="md">
              {application.status}
            </Text>
          </Stack>
          <Stack spacing="xs" align="flex-start">
            <Text color={theme.other.custom_gray} fw="bold" size="sm"></Text>
            <Link href={'/member/' + application.clubId + '/' + application.id}>
              <Button color="blue" variant="filled">
                View Applicants
              </Button>
            </Link>
          </Stack>
        </SimpleGrid>
      </Group>
    </Paper>
  );
};

export default ApplicationButtonMembersView;
