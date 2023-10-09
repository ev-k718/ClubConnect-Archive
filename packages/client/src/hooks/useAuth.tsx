import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Router from 'next/router';

const sessionStorageName = 'club-cc-token';
const getAccessTokenFn = async () => {
  const { token } = await fetch('/api/auth/getToken').then((res) => res.json());
  sessionStorage.setItem(sessionStorageName, token);
  return token;
};

const getAccessToken = () => {
  return useQuery(['userAuth'], () => getAccessTokenFn());
};

const logout = () => {
  Router.push('/api/auth/logout');
};

const getCurrUserClubMembershipsFn = async () => {
  const token = await getAccessTokenFn();

  const res = await axios({
    method: 'GET',
    url: `${process.env.NEXT_PUBLIC_API_URL}/api/user/getClubsOwnedAndMemberOf`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const getUserClubMemberships = () => {
  const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
  return useQuery(
    ['userClubMembership'],
    () => getCurrUserClubMembershipsFn(),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  );
};

const useAuth = () => {
  return {
    getAccessToken,
    logout,
    getUserClubMemberships,
  };
};

export default useAuth;
