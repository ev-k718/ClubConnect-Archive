import {
  Button,
  Divider,
  Flex,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { ClubMembership, User } from 'types/dbTypes';

import AddOwnerOrMemberModal from './addOwnerOrMemberModal';
import MemberTile from './memberTile';

type Props = {
  members: ClubMembership[];
  owners: User[];
};

const MembersTab = ({ owners, members }: Props) => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);

  const memberTiles = members.map((member: ClubMembership, index: number) => (
    <MemberTile member={member.user} owner={false} id={member.id} key={index} />
  ));

  const ownerTiles = owners.map((owner: User, index: number) => (
    <MemberTile member={owner} owner={true} id={owner.id} key={index} />
  ));

  function labels() {
    return (
      <>
        <Flex direction="row" w="100%">
          <Flex direction="row" w="100%" px={40} gap={10} mb="sm">
            <Flex direction="column" w="5%" />
            <Flex direction="column" w="50%">
              <Text fz="sm">Name</Text>
            </Flex>

            <Flex direction="column" w="25%"></Flex>
          </Flex>
          <Flex />
        </Flex>
        <Divider
          orientation="horizontal"
          color={theme.other.gray}
          mb="xl"
          style={{ width: '100%' }}
        />
      </>
    );
  }

  return (
    <>
      <Paper pl="15%" pr="15%" pt="xl">
        <AddOwnerOrMemberModal opened={opened} close={close} />
        <Flex direction="row" w="100%" px={40} mb={20} mt="lg">
          <Flex direction="column" w="85%" rowGap={10}>
            <Paper mt="sm">
              <Title order={1}> Club's Members </Title>
              <Text color={'gray.6'}>
                Manage your club's members and their account permissions here.
              </Text>
            </Paper>
          </Flex>
          <Flex direction="column" w="15%" align="center" justify="center">
            {/* <Button leftIcon={<IconPlus />} variant="outline" onClick={open}> */}
            <Button leftIcon={<IconPlus />} variant="outline" onClick={open}>
              Add Member
            </Button>
          </Flex>
        </Flex>
        <Flex direction="row" w="100%" px={40} mb={20} mt="lg">
          <Divider
            orientation="horizontal"
            color={theme.other.gray}
            mb="md"
            style={{ width: '100%' }}
          />
        </Flex>

        <Flex direction="row" w="100%" px={40} gap={10} mb={20} mt="lg">
          <Flex direction="column" w="30%" rowGap={10} mr="md">
            <Title order={4}>Admin users</Title>
            <Text fz="sm" color={'gray.6'}>
              Admins can add or remove members, manage applications and all
              related club information
            </Text>
          </Flex>
          <Flex direction="column" w="70%">
            {ownerTiles}
          </Flex>
        </Flex>
        <Flex direction="row" w="100%" px={40} mb={20} mt="lg">
          <Divider
            orientation="horizontal"
            color={theme.other.gray}
            mb="xl"
            style={{ width: '100%' }}
          />
        </Flex>

        <Flex direction="row" w="100%" px={40} gap={10} mb={20} mt="lg">
          <Flex direction="column" w="30%" rowGap={10} mr="md">
            <Title order={4}>Member users</Title>
            <Text fz="sm" color={'gray.6'}>
              Members can view applications and grade applicants.
            </Text>
          </Flex>
          {/* Below are the labels: name & last active */}
          <Flex direction="column" w="70%">
            {memberTiles}
          </Flex>
        </Flex>
      </Paper>
    </>
  );
};

export default MembersTab;
