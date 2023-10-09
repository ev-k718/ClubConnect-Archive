import axios from "axios";

const globalForTestToken = global as unknown as {token: string};

const getTestToken = async () => {
  if (globalForTestToken.token) return globalForTestToken.token;
  const options = {
    method: 'POST',
    url: 'https://dev-f1yfgf6nxnx2wn2m.us.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID || '',
      client_secret: process.env.AUTH0_CLIENT_SECRET || '',
      audience: process.env.AUTH0_AUDIENCE || '',
    }),
  };

  const { access_token } = await axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  if (process.env.NODE_ENV === 'test') globalForTestToken.token = access_token;
  return access_token;
};

//const testAccessToken = globalForTestToken.token || await getTestToken();


export default getTestToken;