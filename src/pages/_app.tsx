import * as React from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClientProvider, QueryClient } from 'react-query';
import Layout from '@src/components/Layout';
import MainContext from '@src/contexts';
import createEmotionCache from '@styles/createEmotionCache';
import theme from '@styles/theme';

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
      <CacheProvider value={emotionCache}>
        <Head>
          <title>My page</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <MainContext>
          <ThemeProvider theme={theme}>
            <Layout>
              <CssBaseline />
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </MainContext>
      </CacheProvider>
    </QueryClientProvider>
  );
}
