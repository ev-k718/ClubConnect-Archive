import NavBar from '@/components/navbar';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

const AdminLayout = withPageAuthRequired(({ children }: Props) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
});

export default AdminLayout;
