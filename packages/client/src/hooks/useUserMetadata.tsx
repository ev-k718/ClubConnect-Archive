import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import useAuth from './useAuth';

const useUserMetadataFn = async (token: string) => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const useUserMetadata = () => {
  const { getAccessToken } = useAuth();
  const { data: token } = getAccessToken();

  return useQuery({
    queryKey: ['userMetadata'],
    queryFn: () => useUserMetadataFn(token),
    enabled: !!token,
  });
};

export default useUserMetadata;
