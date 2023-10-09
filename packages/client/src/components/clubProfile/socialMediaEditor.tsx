import useAuth from '@/hooks/useAuth';
import {
  Button,
  Flex,
  Paper,
  Select,
  SelectItem,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { SocialMedia } from 'types/dbTypes';

import SocialMediaBar from './socialMediaBar';

const getToken = () => {
  const { getAccessToken: getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return token;
};

type Props = {
  socialMedia: SocialMedia[];
  clubProfileId: string;
};

const SocialMediaEditor = ({ socialMedia, clubProfileId }: Props) => {
  const [mediaType, setType] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const token = getToken();
  const queryClient = useQueryClient();

  const socialMediaExistentMapping = new Map([
    ['FACEBOOK', false],
    ['TWITTER', false],
    ['INSTAGRAM', false],
    ['LINKEDIN', false],
    ['WEBSITE', false],
  ]);

  const createNewSocialMedia = useMutation({
    mutationFn: (body: {}) => {
      return axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/clubProfile/${clubProfileId}/socialMedia`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: body,
      });
    },
    onError: () => {
      showNotification({
        message: `Error Adding New Social Media`,
        icon: <IconX size={16} />,
        color: 'red',
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      showNotification({
        message: `Success Adding New Social Media`,
        icon: <IconCheck size={16} />,
      });
    },
  });

  //maps socialMedias that exist in the club
  const mapMedia = () => {
    return socialMedia.map((media, index) => {
      socialMediaExistentMapping.set(media.type, true); //sets to true since club has it
      return <SocialMediaBar socialMedia={media} index={index} key={index} />;
    });
  };

  //only visible when a socialMedia is selected to add
  const loadUrl = () => {
    return (
      <>
        <Flex
          direction="row"
          w="100%"
          gap={10}
          align={'center'}
          justify={'center'}
        >
          <Flex direction="column" w="50%">
            <TextInput
              withAsterisk
              onChange={(event) => setUrl(event.currentTarget.value)}
              label="url:"
            />
          </Flex>
        </Flex>
        <Flex
          direction="row"
          w="100%"
          gap={10}
          align={'center'}
          justify={'center'}
        >
          <Button
            mt={15}
            mb={20}
            type="submit"
            onClick={(event) => {
              if (url) {
                //add it to DB
                event.preventDefault();
                createNewSocialMedia.mutate({
                  type: mediaType,
                  url: url,
                });
                setType(null); //resets UI
              }
            }}
          >
            Add Media
          </Button>
        </Flex>
      </>
    );
  };

  const selectAddMediaBar = () => {
    let data_: (string | SelectItem)[] | { value: string; label: string }[] =
      [];
    socialMediaExistentMapping.forEach((sm, key) => {
      if (!sm) {
        let element = { value: key, label: key.toLowerCase() };
        data_.push(element);
      }
    });

    return (
      <Flex
        direction="row"
        w="100%"
        gap={10}
        align={'center'}
        justify={'center'}
      >
        <Flex direction="column" w="50%">
          <Select
            label="Add Social Media"
            placeholder="Pick one"
            data={data_}
            value={mediaType}
            onChange={setType}
          />
        </Flex>
      </Flex>
    );
  };

  return (
    <Paper radius="md" p="md">
      {/* MAP existing socialMedias */}
      {mapMedia()}
      {selectAddMediaBar()}
      {mediaType ? loadUrl() : <></>}
    </Paper>
  );
};

export default SocialMediaEditor;
