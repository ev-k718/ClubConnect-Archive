import withValidateMembership from '@/HOC/withValidateMembership';
import EditCreateApplication from '@/components/EditCreateApplication';
import useNavigationLock from '@/hooks/useNavigationLock';
import AdminLayout from '@/layouts/adminLayout';
import { Button, Divider, Group } from '@mantine/core';
import { NextPage } from 'next';
import { ReactElement, SetStateAction, useState } from 'react';
import { NextPageWithLayout } from 'types/layout';

const CreateApplication: NextPageWithLayout = () => {
  const [unsaved, setUnsaved] = useState(false);
  useNavigationLock(unsaved);
  return (
    <>
      <EditCreateApplication
        applicationId={null}
        unsaved={unsaved}
        setUnsaved={setUnsaved}
      />
      ;
    </>
  );
};

CreateApplication.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default withValidateMembership(CreateApplication, 'membersOnly');
