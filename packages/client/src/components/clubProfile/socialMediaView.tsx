import { ActionIcon } from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconWorld,
} from '@tabler/icons-react';
import React from 'react';
import { SocialMedia } from 'types/dbTypes';

//application object
type Props = {
  media: SocialMedia;
};

const SocialMediaView = ({ media }: Props) => { 
  const  url = media.url;
  if(url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') ){
    //do nothing
  } else {
    media.url = '//' + url;
  }
  return (
    <ActionIcon size="xl" onClick={() => window.open(media.url,  "_blank")}>
      {media.type === 'FACEBOOK' ? (
        <>
          <IconBrandFacebook/>
        </>
      ) : media.type === 'TWITTER' ? (
        <>
          <IconBrandTwitter/> 
        </>
      ) : media.type === 'INSTAGRAM' ? (
        <>
          <IconBrandInstagram/> 
        </>
      ) : media.type === 'LINKEDIN' ? (
        <>
          <IconBrandLinkedin /> 
        </>
      ) : (
        <>
          <IconWorld /> 
        </>
      )}
    </ActionIcon>
  );
};

export default SocialMediaView;
