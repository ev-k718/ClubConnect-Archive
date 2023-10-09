import { RingProgress, Text, SimpleGrid, Paper, Center, Group } from '@mantine/core';

type SingleScore = {
    scoringCriteriaId: string;
    score: number;
  }

type StatsRingProps = {
    data: SingleScore[];
    criteria: any;
}

const StatCard = ({ data, criteria }: StatsRingProps) => {
  const stats = data.map((stat) => {
    return (
      <Paper radius="md" p="xs" key={stat.scoringCriteriaId}>
        <Group position="apart">
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: (stat.score * 10), color: 'blue' }]}
            label={
              <Center>
                {stat.score}
              </Center>
            }
          />
          <div>
            {/* <Text color="dimmed" size="sm" transform="uppercase" weight={700}> */}
            <Text>
              {criteria[stat.scoringCriteriaId]}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return (
    <SimpleGrid cols={1} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
      {stats}
    </SimpleGrid>
  );
}

export default StatCard;