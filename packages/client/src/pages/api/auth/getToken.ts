import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';

const handler = withApiAuthRequired(async (req, res) => {
  const { accessToken } = await getAccessToken(req, res);
  return res.status(200).json({ token: accessToken });
});

export default handler;
