import { ActionIcon, Flex, Text, TextInput, Title } from '@mantine/core';
import { UseFormReturnType, useForm } from '@mantine/form';
import { IconEdit, IconSquareCheck, IconSquareX } from '@tabler/icons-react';
import { useState } from 'react';

import { FormValues } from './clubInfoTab';

type Props = {
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  form: UseFormReturnType<FormValues>;
};

const ContactInfo = ({ contactInfo, form }: Props) => {
  //UI: the left field label
  function renderFieldLabelSide(label: string) {
    return (
      <Flex direction="column" w="20%" pr="lg">
        <Text fz="sm" align="left">
          {label}
        </Text>
      </Flex>
    );
  }

  //UI: the input box to fill in
  function renderInputSide(
    ariaLabel: string,
    placeholder: string,
    formPath: string,
  ) {
    return (
      <Flex direction="column" w="80%">
        <form>
          <TextInput
            aria-label={ariaLabel}
            placeholder={placeholder}
            variant="filled"
            {...form.getInputProps(formPath)}
          />
        </form>
      </Flex>
    );
  }

  return (
    <>
      <Flex direction="row" w="100%" gap={10} mb={20} pr="20%">
        {renderFieldLabelSide('Name')}
        {renderInputSide('Name', 'Contact Name', 'contactInformation.name')}
      </Flex>

      <Flex direction="row" w="100%" gap={10} mb={20} pr="20%">
        {renderFieldLabelSide('Email')}
        {renderInputSide('Email', 'Contact Email', 'contactInformation.email')}
      </Flex>

      <Flex direction="row" w="100%" gap={10} mb={20} pr="20%">
        {renderFieldLabelSide('Phone')}
        {renderInputSide(
          'Phone',
          'Contact Phone Number',
          'contactInformation.phone',
        )}
      </Flex>
    </>
  );
};

export default ContactInfo;
