import * as React from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClientProvider, QueryClient, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Layout from '@src/components/Layout';
import MainContext from '@src/contexts';
import createEmotionCache from '@styles/createEmotionCache';
import theme from '@styles/theme';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
axios.defaults.baseURL = process.env.NEXT_APP_URL!;
axios.defaults.withCredentials = true;

const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps): any {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <CacheProvider value={emotionCache}>
          <MainContext>
            <Head>
              <title>My page</title>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
              <Layout>
                <CssBaseline />
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </MainContext>
        </CacheProvider>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
