import {
  Button,
  Center,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { keys } from '@mantine/utils';
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import CsvDownloader from 'react-csv-downloader';

import { SingleApplicantViewModal } from './singleApplicantViewModal';

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: '21 px',
    height: '21 px',
    borderRadius: '21 px',
  },
}));

type SingleScore = {
  scoringCriteriaId: string;
  score: number;
};

type RowData = {
  submissionId: string;
  applicantId: string;
  applicationId: string;
  averageScores: SingleScore[];
  overallAverageScore: number;
  answers: any[];
  questions: any[];
  comments: any[];
  criteria: any[];
  numComments: number;
  scores: any[];
  name: string;
  email: string;
};

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

const createCSVfromRowData = (data: RowData[]) => {
  const csvData = data.map((row: RowData) => {
    return {
      name: row.name,
      email: row.email,
      averageOverallScore: row.overallAverageScore.toString(),
      numComments: row.numComments.toString(),
    };
  });
  return csvData;
};

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item: RowData) =>
    keys(item).some((key) => String(item[key]).includes(query)),
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string },
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].toString().localeCompare(a[sortBy].toString());
      }

      return a[sortBy].toString().localeCompare(b[sortBy].toString());
    }),
    payload.search,
  );
}

const Spreadsheet = ({ data }: TableSortProps) => {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value }),
    );
  };

  const rows = sortedData.map((row) => {
    return (
      <tr key={row.submissionId}>
        <td>
          <Center>{row.name}</Center>
        </td>
        <td>
          <Center>{row.email}</Center>
        </td>
        <td>
          <Center>{row.overallAverageScore}</Center>
        </td>
        <td>
          <Center>{row.numComments}</Center>
        </td>
        <td>
          <Center>
            <SingleApplicantViewModal rowData={row} key={row.submissionId} />
          </Center>
        </td>
      </tr>
    );
  });

  const csvData = createCSVfromRowData(data);

  return (
    <ScrollArea>
      <Group align="flex-start" position="right">
        <TextInput
          placeholder="Search by any field"
          mb="md"
          icon={<IconSearch size="0.9rem" stroke={1.5} />}
          value={search}
          onChange={handleSearchChange}
        />
        <CsvDownloader filename="downloadedCSV.csv" datas={csvData}>
          <Button variant="outline">Download .csv</Button>
        </CsvDownloader>
      </Group>
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        miw={700}
        sx={{ tableLayout: 'fixed' }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'email'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('email')}
            >
              Email
            </Th>
            <Th
              sorted={sortBy === 'overallAverageScore'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('overallAverageScore')}
            >
              Average Score
            </Th>
            <Th
              sorted={sortBy === 'numComments'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('numComments')}
            >
              Comments
            </Th>
            <th>
              <Center>View Applicant</Center>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={5}>
                <Text weight={500} align="center">
                  No submissions found!
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
};

export default Spreadsheet;
