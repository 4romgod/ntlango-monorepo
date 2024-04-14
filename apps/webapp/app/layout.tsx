import '@/components/global.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CustomThemeProvider from '@/components/theme/theme';
import { CssBaseline } from '@mui/material';
import Navbar from '@/components/navigation/navbar';

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
