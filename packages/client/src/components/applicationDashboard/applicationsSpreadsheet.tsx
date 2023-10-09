import {
  Button,
  Center,
  Grid,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  createStyles,
} from '@mantine/core';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

type RowData = {
  id: number;
  clubName: string;
  appName: string;
  status: string;
  dueDate: string;
};
type SpreadsheetProps = {
  data: Array<RowData>;
};

type ThProps = {
  children: React.ReactNode;
};

function Th({ children }: ThProps) {
  const { classes } = useStyles();

  return (
    <th className={classes.th}>
      <Group position="apart">
        <Text weight={500} size="sm">
          {children}
        </Text>
      </Group>
    </th>
  );
}

const ApplicationsSpreadsheet = ({ data }: SpreadsheetProps) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const rows = data.map((applicationSubmission) => (
    <tr key={applicationSubmission.id}>
      <td>{applicationSubmission.clubName}</td>
      <td>{applicationSubmission.appName}</td>
      <td>{applicationSubmission.status}</td>
      <td>
        {new Date(applicationSubmission.dueDate).toLocaleString(
          'en-US',
          dateTimeOptions,
        )}
      </td>
      <td>
        <Link
          href={`/applicant/application-dashboard/${applicationSubmission.id}`}
        >
          <Button>
            {applicationSubmission.status === 'SUBMITTED'
              ? 'View Submission'
              : 'Enter Application'}
          </Button>
        </Link>
      </td>
    </tr>
  ));

  return (
    <ScrollArea offsetScrollbars type="always" scrollHideDelay={50}>
      <Center>
        <Table
          horizontalSpacing="md"
          verticalSpacing="lg"
          sx={{ tableLayout: 'fixed', minWidth: 700, maxWidth: 1100 }}
        >
          <thead>
            <tr>
              <Th>Club</Th>
              <Th>Application</Th>
              <Th>Status</Th>
              <Th>Due Date</Th>
              <Th> </Th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <tr>
                <td colSpan={4}>
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Center>
    </ScrollArea>
  );
};

export default ApplicationsSpreadsheet;
