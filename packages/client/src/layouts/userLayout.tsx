import ApplicantNavBar from '@/components/applicantNavbar';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const UserLayout = withPageAuthRequired(({ children }: Props) => {
  return (
    <>
      <ApplicantNavBar />
      <main>{children}</main>
    </>
  );
});

export default UserLayout;
