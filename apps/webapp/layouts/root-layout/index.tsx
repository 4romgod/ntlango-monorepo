'use client';

import '@/components/global.css';
import React, { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { CustomAppContextProvider } from '@/components/context/AppContext';
import { ApolloWrapper } from '@/data/graphql/apollo-wrapper';
import { SessionProvider } from 'next-auth/react';
import CustomThemeProvider from '@/components/context/providers/ThemeProvider';
import ToastProvider from '@/components/context/providers/ToastProvider';
import MainNavigation from '@/components/navigation/main';
import Footer from '@/components/footer';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { Session } from 'next-auth';

const TopProgressBar = dynamic(() => import('@/components/core/progress/TopProgressBar'), { ssr: false });

type RootLayoutProps = { children: ReactNode; session: Session | null };

export default function RootLayout({ children, session }: RootLayoutProps) {
  const navHeight = 64;

  const isAuthN = Boolean(session?.user?.userId && session?.user?.token);

  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <AppRouterCacheProvider>
            <SessionProvider session={session}>
              <CustomAppContextProvider>
                <CustomThemeProvider>
                  <ToastProvider />
                  <TopProgressBar />
                  <MainNavigation isAuthN={isAuthN} />
                  <Box
                    sx={{
                      minHeight: '100vh',
                      marginTop: `${navHeight}px`,
                    }}
                  >
                    {children}
                  </Box>
                  <Box>
                    <Footer />
                  </Box>
                </CustomThemeProvider>
              </CustomAppContextProvider>
            </SessionProvider>
          </AppRouterCacheProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
