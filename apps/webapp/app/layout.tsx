import '@/components/global.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CustomThemeProvider from '@/components/theme/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <CustomThemeProvider>{children}</CustomThemeProvider>
      </AppRouterCacheProvider>
    </html>
  );
}
