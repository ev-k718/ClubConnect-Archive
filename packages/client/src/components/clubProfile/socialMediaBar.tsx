import useAuth from '@/hooks/useAuth';
import {
  ActionIcon, 
  Flex, 
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconCheck,
  IconDatabaseExport, 
  IconTrash,
  IconWorld,
  IconX,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ReactElement, useEffect } from 'react';
import { useState } from 'react';
import { json } from 'stream/consumers';
import { SocialMedia } from 'types/dbTypes';

const getToken = () => {
  const { getAccessToken: getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return token;
};

type Props = {
  socialMedia: SocialMedia;
  index: number;
};

const SocialMediaBar = ({ socialMedia, index }: Props) => {
  const token = getToken();
  const queryClient = useQueryClient();
  const origValue = socialMedia.url;
  const [edited, setEdited] = useState(false);
  const [value, setValue] = useState(origValue);
  //console.log(socialMedia);

  const socialMediaIconMapping = new Map([
    ['FACEBOOK', <IconBrandFacebook />],
    ['TWITTER', <IconBrandTwitter />],
    ['INSTAGRAM', <IconBrandInstagram />],
    ['LINKEDIN', <IconBrandLinkedin />],
    ['WEBSITE', <IconWorld />],
  ]);

  //update social media URL
  const editSocialMedia = useMutation({
    mutationFn: (body: {}) => {
      return axios({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/clubProfile/socialMedia/${socialMedia.id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: body,
      });
    },
    onError: (error) => {
        showNotification({
          message: `Error Updating Social Media`,
          icon: <IconX size={16} />,
          color: 'red',
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries();
        showNotification({
          message: `Success Updating Social Media`,
          icon: <IconCheck size={16} />,
        });  
        setEdited(false);
      },
  });

  const deleteSocialMedia = useMutation({
    mutationFn: (id: string) => {
      return axios({
        method: 'DELETE',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/clubProfile/socialMedia/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onError: (error) => {
      showNotification({
        message: `Error Deleting Social Media`,
        icon: <IconX size={16} />,
        color: 'red',
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      showNotification({
        message: `Success Deleting Social Media`,
        icon: <IconCheck size={16} />,
      });
    },
  });

  const icon = socialMediaIconMapping.get(socialMedia.type) as ReactElement;
  return (
    <Flex
      direction="row"
      w="100%"
      gap={10}
      mb={20}
      align={'center'}
      key={index}
      justify={'center'}
    >
      <Flex direction="column">{icon}</Flex>

      <Flex direction="column" w="50%">
        <TextInput
          aria-label={'url'}
          variant="filled"
          placeholder={socialMedia.url}
          value={value}
          onChange={(event) => {
            setEdited(true);
            setValue(event.currentTarget.value);
          }}
        />
      </Flex>
      <ActionIcon
        color="red"
        onClick={() => deleteSocialMedia.mutate(socialMedia.id)}
      >
        <IconTrash size="1rem"/>
      </ActionIcon>
      {edited ? (
        <>
          <ActionIcon
            color="blue"
            onClick={() => {
              let jsonBody = {
                url: value,
              };
              editSocialMedia.mutate(jsonBody);
            }}
          >
            <IconDatabaseExport size="1rem" />
          </ActionIcon>
          <ActionIcon color="gray" onClick={() => { 
            setValue(origValue);
            setEdited(false); 
          }}>
            <IconX size="1rem" />
          </ActionIcon>
        </>
      ) : (
        <></>
      )}
    </Flex>
  );
};

export default SocialMediaBar;
