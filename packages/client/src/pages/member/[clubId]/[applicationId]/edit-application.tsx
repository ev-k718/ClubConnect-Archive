import withValidateMembership from '@/HOC/withValidateMembership';
import EditCreateApplication from '@/components/EditCreateApplication';
import useNavigationLock from '@/hooks/useNavigationLock';
import AdminLayout from '@/layouts/adminLayout';
import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { NextPageWithLayout } from 'types/layout';

const EditApplication: NextPageWithLayout = () => {
  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const [unsaved, setUnsaved] = useState(false);
  useNavigationLock(unsaved);
  return (
    <>
      <EditCreateApplication
        applicationId={applicationId}
        unsaved={unsaved}
        setUnsaved={setUnsaved}
      />
    </>
  );
};

EditApplication.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default withValidateMembership(EditApplication, 'membersOnly');
