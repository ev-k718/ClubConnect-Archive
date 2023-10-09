import {
  ActionIcon,
  Group,
  Paper,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { IconEdit, IconSquareCheck, IconSquareX } from '@tabler/icons-react';
import { useState } from 'react';

type Props = {
  fieldName: string;
  placeholder: string;
  originalValue: string;
  inputType: 'textarea' | 'textinput';
  saveFunction?: (newValue: string) => void;
};

const EditableField = ({
  fieldName,
  placeholder,
  originalValue,
  inputType,
  saveFunction,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [currValue, setCurrValue] = useState(originalValue);
  const [prevValue, setPrevValue] = useState(originalValue);
  const handleSave = () => {
    setPrevValue(currValue);
    //saveFunction(currValue);
    setEditing(false);
  };
  const handleDiscard = () => {
    setCurrValue(prevValue);
    setEditing(false);
  };

  const inputField =
    inputType === 'textarea' ? (
      <Textarea
        placeholder={placeholder}
        minRows={2}
        autosize
        value={currValue}
        onChange={(e) => setCurrValue(e.target.value)}
      />
    ) : (
      <TextInput
        placeholder={placeholder}
        value={currValue}
        onChange={(e) => setCurrValue(e.target.value)}
      />
    );

  return (
    <>
      <Paper radius="md" p="md" withBorder>
        <Group position="apart" mb={5}>
          <Title order={4} fw="bold">
            {fieldName}
          </Title>
          {!editing ? (
            <ActionIcon onClick={() => setEditing(true)}>
              <IconEdit />
            </ActionIcon>
          ) : (
            <Group position="center" spacing={1}>
              <ActionIcon
                onClick={() => {
                  handleDiscard();
                }}
              >
                <IconSquareX />
              </ActionIcon>
              <ActionIcon
                onClick={() => {
                  handleSave();
                }}
              >
                <IconSquareCheck />
              </ActionIcon>
            </Group>
          )}
        </Group>

        {editing ? inputField : <Text size="sm">{currValue}</Text>}
      </Paper>
    </>
  );
};

export default EditableField;
