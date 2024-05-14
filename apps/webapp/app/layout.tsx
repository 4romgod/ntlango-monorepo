'use client';

import '@/components/global.css';
import { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { useCustomAppContext, CustomAppContextProvider } from '@/components/app-context';
import MainNavigation from '@/components/navigation/main';
import Footer from '@/components/footer';
import { ApolloWrapper } from '@/lib/graphql/apollo-provider';

function CustomThemeProvider({ children }: { children: ReactNode }) {
  const { appTheme } = useCustomAppContext();

  return (
    <ThemeProvider theme={appTheme!}>
      <CssBaseline />
      <body>
        <MainNavigation />
        <Box component="div" marginTop={15} style={{ minHeight: '100vh' }}>
          {children}
        </Box>
        <Footer />
      </body>
    </ThemeProvider>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <ApolloWrapper>
        <AppRouterCacheProvider>
          <CustomAppContextProvider>
            <CustomThemeProvider>{children}</CustomThemeProvider>
          </CustomAppContextProvider>
        </AppRouterCacheProvider>
      </ApolloWrapper>
    </html>
  );
}
