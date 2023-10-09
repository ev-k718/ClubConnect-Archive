import useAuth from '@/hooks/useAuth';
import {
  Button,
  Divider,
  Flex,
  Group, 
  Paper,
  Text,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification, useNotifications } from '@mantine/notifications';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ClubProfile, SocialMedia } from 'types/dbTypes';

import ContactInfo from './contactInfo';
import SocialMediaEditor from './socialMediaEditor';

const getToken = () => {
  const { getAccessToken: getAccessToken } = useAuth();
  const { data: token } = getAccessToken();
  return token;
};

// template for our Forms
export interface FormValues {
  description: string;
  applicationCycle: string;
  contactInformation: {
    name: string;
    email: string;
    phone: string;
  };
  socialMedia: SocialMedia[];
}

type Props = {
  clubProfile: ClubProfile;
};

const ClubInfoTab = ({ clubProfile }: Props) => {
  const token = getToken();
  const queryClient = useQueryClient();
  const updateClubContactInfo = useMutation({
    mutationFn: (body: {}) => {
      return axios({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/clubProfile/${clubProfile.id}/contactInfo`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: body,
      });
    },
    onError: () => {
      showNotification({
        message: 'Error updating club information',
        color: 'red',
        icon: <IconAlertTriangle size={16} />,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      showNotification({
        message: 'Updated Club Information',
        icon: <IconCheck size={16} />,
      });
    },
  });

  //TODO, pass a value to mutate (changes url based on that sense the mutations are the same code)
  const updateGeneralInfo = useMutation({
    mutationFn: (body: {}) => {
      return axios({
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/clubProfile/${clubProfile.id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: body,
      });
    },
    onError: (error) => {
      showNotification({
        message: 'Error updating club information',
        color: 'red',
        icon: <IconAlertTriangle size={16} />,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const theme = useMantineTheme();
  const form = useForm<FormValues>({
    initialValues: {
      description: clubProfile.description,
      applicationCycle: clubProfile.applicationCycleDescription,
      contactInformation: {
        name: clubProfile.contactInfo?.name ?? '',
        email: clubProfile.contactInfo?.email ?? '',
        phone: clubProfile.contactInfo?.phoneNumber ?? '',
      },
      socialMedia: clubProfile.socialMedia,
    },
  });

  //based on the form changes, updates the clubProfile contents in DB
  const handleSave = (values: FormValues) => {
    var jsonBody = {};
    jsonBody = form.isDirty('contactInformation.name')
      ? { ...jsonBody, name: values.contactInformation.name }
      : jsonBody;
    jsonBody = form.isDirty('contactInformation.email')
      ? { ...jsonBody, email: values.contactInformation.email }
      : jsonBody;
    jsonBody = form.isDirty('contactInformation.phone')
      ? { ...jsonBody, phoneNumber: values.contactInformation.phone }
      : jsonBody;

    updateClubContactInfo.mutate(jsonBody);

    //updates description & app cycle
    jsonBody = {};
    jsonBody = form.isDirty('description')
      ? { ...jsonBody, description: values.description }
      : jsonBody;
    jsonBody = form.isDirty('applicationCycle')
      ? { ...jsonBody, applicationCycleDescription: values.applicationCycle }
      : jsonBody;

    updateGeneralInfo.mutate(jsonBody);
  };

  //UI helper func to create a row in the form
  function renderFormsRow(
    component: string, //TextInput or Textarea
    label: string,
    placeholder: string,
    formPath: string,
  ) {
    return (
      <Flex direction="row" w="100%" gap={10} mb={20} pr="20%">
        <Flex direction="column" w="20%" pr="lg">
          <Text fz="sm" align="left">
            {label}
          </Text>
        </Flex>

        <Flex direction="column" w="80%">
          <form>
            {component === 'Textarea' ? (
              <Textarea
                aria-label={label}
                variant="filled"
                placeholder={placeholder}
                autosize
                minRows={4}
                {...form.getInputProps(formPath)}
              />
            ) : (
              <TextInput
                aria-label={label}
                variant="filled"
                placeholder={placeholder}
                {...form.getInputProps(formPath)}
              />
            )}
          </form>
        </Flex>
      </Flex>
    );
  }

  return (
    <>
      <Paper pl="15%" pr="15%" pt="xl">
        <Title order={4} c="gray.9" pb={10}>
          General Information
        </Title>
        <Divider orientation="horizontal" color={theme.other.gray} mb="xl" />

        {/* Description */}
        {renderFormsRow(
          'Textarea',
          'Description',
          'Enter the description of your club.',
          'description',
        )}

        {/* Application Cycle */}
        {renderFormsRow(
          'TextInput',
          'Application Cycle',
          'Enter an approximate time for applications.',
          'applicationCycle',
        )}
      </Paper>

      <Paper pl="15%" pr="15%" pt="xl">
        <Title order={4} c="gray.9" pb={10}>
          Contact Information
        </Title>
        <Divider orientation="horizontal" color={theme.other.gray} mb="xl" />
        <ContactInfo contactInfo={form.values.contactInformation} form={form} />
        
        <Flex direction="row" w="100%" px={40} my={20} justify="center" pt={15}>
        <form onSubmit={form.onSubmit((values) => handleSave(values))}>
          <Group position="center">
            <Button type="submit">Save Profile</Button>
          </Group>
        </form>
        </Flex>
         
      </Paper> 

      <Paper pl="15%" pr="15%" pt="xl">
        <Title order={4} c="gray.9" pb={10}>
          Social Media
        </Title>
        <Divider orientation="horizontal" color={theme.other.gray} mb="xl" />
        <SocialMediaEditor
          socialMedia={clubProfile.socialMedia}
          clubProfileId={clubProfile.id}
        />
      </Paper>

      {/* <Flex direction="row" w="100%" px={40} my={20} justify="center">
        <form onSubmit={form.onSubmit((values) => handleSave(values))}>
          <Group position="right">
            <Button type="submit">Save Profile</Button>
          </Group>
        </form>
      </Flex> */}
    </>
  );
};

export default ClubInfoTab;
