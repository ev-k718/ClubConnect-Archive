import { AppSubmissionFormType } from '@/pages/applicant/application-dashboard/[appSubmissionId]';
import { FileInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { error } from 'console';
import React, { SetStateAction } from 'react';
import { Question } from 'types/dbTypes';

type Props = {
  question: Question;
  form: UseFormReturnType<AppSubmissionFormType>;
  id: string;
  setUnsavedChanges: (value: SetStateAction<boolean>) => void;
  token: string;
  appSubmissionId: string;
  questionId: string;
};

const Filedrop = ({
  question,
  form,
  id,
  setUnsavedChanges,
  token,
  appSubmissionId,
  questionId,
}: Props) => {
  const [file, setFile] = React.useState<File | null>(null);
  //
  const uploadFileAndUpdateUrl = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error('No file selected');
      }
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/s3FileStorage/upload/${appSubmissionId}/${questionId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return res.data;
    },
    onSuccess: (data) => {
      form.setFieldValue(`answers.${id}.value`, file?.name || '');
      setUnsavedChanges(false);
      showNotification({
        message: 'File uploaded successfully',
        icon: <IconUpload size={16} />,
      });
    },
    onError: (error: any) => {
      if(error.message === 'No file selected') return;
      showNotification({
        message: error.message,
        color: 'red',
      });
    },
  });

  return (
    <FileInput
      required={question.isRequired}
      icon={<IconUpload />}
      placeholder={form.values.answers[id]?.filename || 'No file selected'}
      label={question.value}
      disabled={form.values.submitted}
      /* Eventually we want to change this to aws url instead of name*/
      onChange={(file) => {
        setFile(file);
        setUnsavedChanges(true);
        uploadFileAndUpdateUrl.mutate();
        form.clearErrors();
      }}
      accept="application/pdf"
      error={form.errors.answers?.[question.id as keyof typeof form.errors.answers]}
    />
  );
};

export default Filedrop;
