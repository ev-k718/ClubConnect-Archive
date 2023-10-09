import { UserProvider } from '@auth0/nextjs-auth0/client';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import Head from 'next/head';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from 'types/layout';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Head>
          <title>Club Connect</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>

        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'light',
            other: {
              primary_blue: '#0072CE',
              secondary_blue: '#002D72',
              custom_black: '#202020',
              custom_gray: '#9F9F9F',
            },
          }}
        >
          <NotificationsProvider
            limit={5}
            position="top-center"
            autoClose={3000}
          />
          {getLayout(<Component {...pageProps} />)}
        </MantineProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
