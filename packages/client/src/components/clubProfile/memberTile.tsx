import { useUser } from '@auth0/nextjs-auth0/client';
import {
  ActionIcon,
  Divider,
  Flex,
  Paper,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFaceId, IconTrash } from '@tabler/icons-react';
import { User } from 'types/dbTypes';

import DeleteOwnerOrMemberModal from './deleteOwnerOrMemberModal';

type Props = {
  member: User;
  owner: boolean;
  id: string;
};

const MemberTile = ({ member, owner, id }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useUser();

  return (
    <>
      <Paper radius="md" mb="md">
        <Flex direction="row" w="100%" px={40} gap={10} mb={20}>
          <Flex direction="column" w="5%" align="center" justify="center">
            <ThemeIcon variant="gradient" radius="xl" size="lg">
              <IconFaceId />
            </ThemeIcon>
          </Flex>
          <Flex direction="column" w="50%">
            <Flex direction="row" w="100%">
              <Text fz="md" weight={500}>
                {member.name}
              </Text>
            </Flex>
            <Flex direction="row" w="100%">
              <Text fz="sm" color="gray.7">
                {member.email}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column" w="20%">
            {/* filler space */}
          </Flex>
          <Flex direction="column" w="5%" justify="center">
            {((owner && user?.email !== member.email) || !owner) && (
              <ActionIcon color="gray.5" size="sm" onClick={open}>
                <IconTrash />
              </ActionIcon>
            )}
          </Flex>
        </Flex>
        <Divider
          orientation="horizontal"
          color={'gray.2'}
          style={{ width: '100%' }}
        />
      </Paper>
      <DeleteOwnerOrMemberModal
        id={id}
        name={member.name}
        opened={opened}
        close={close}
        isOwner={owner}
      />
    </>
  );
};

export default MemberTile;
