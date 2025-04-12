'use client';

import '@/components/global.css';
import React, { ReactNode, useState } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { CustomAppContextProvider } from '@/components/app-context';
import { ApolloWrapper } from '@/data/graphql/apollo-provider';
import { SessionProvider } from 'next-auth/react';
import CustomThemeProvider from '@/components/custom-providers/theme-provider';
import ToastProvider from '@/components/custom-providers/toast-provider';
import MainNavigation from '@/components/navigation/main';
import Footer from '@/components/footer';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { Session } from 'next-auth';

const TopProgressBar = dynamic(() => import('@/components/progress-bar'), { ssr: false });

type RootLayoutProps = { children: ReactNode; session: Session | null };


export default async function RootLayout({ children, session }: RootLayoutProps) {
  const [navHeight, setNavHeight] = useState(0);

  return (
    <html lang="en">
      <ApolloWrapper>
        <AppRouterCacheProvider>
          <SessionProvider session={session}>
            <CustomAppContextProvider>
              <CustomThemeProvider>
                <body>
                    <ToastProvider />
                    <TopProgressBar />
                    <MainNavigation
                        isAuthN={Boolean(session)}
                        onHeightChange={(height: number) => setNavHeight(height)}
                    />
                    <Box
                        component="div"
                        sx={{
                            minHeight: '100vh',
                            marginTop: `${navHeight}px`,
                        }}
                    >
                        {children}
                    </Box>
                    <Box
                        component="div"
                        sx={{
                        marginTop: 10,
                        }}
                    >
                        <Footer />
                    </Box>
                </body>
              </CustomThemeProvider>
            </CustomAppContextProvider>
          </SessionProvider>
        </AppRouterCacheProvider>
      </ApolloWrapper>
    </html>
  );
}
