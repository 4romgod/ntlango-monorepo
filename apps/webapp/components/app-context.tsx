'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { PaletteMode, Theme } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { getDesignTokens } from '@/components/theme/design-tokens';

interface CustomAppContextType {
  isAuthN: boolean;
  setIsAuthN: React.Dispatch<React.SetStateAction<boolean>>;
  themeMode: PaletteMode;
  setThemeMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
  appTheme: Theme | undefined;
}

const CustomAppContext = createContext<CustomAppContextType>({
  isAuthN: false,
  setIsAuthN: () => {},
  themeMode: 'light',
  setThemeMode: () => {},
  appTheme: undefined,
});

export const useCustomAppContext = () => useContext(CustomAppContext);

export const CustomAppContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthN, setIsAuthN] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<PaletteMode>('light');
  const theme = useMemo(() => createTheme(getDesignTokens(themeMode)), [themeMode]);

  return (
    <CustomAppContext.Provider
      value={{
        isAuthN,
        setIsAuthN,
        themeMode,
        setThemeMode,
        appTheme: theme,
      }}
    >
      {children}
    </CustomAppContext.Provider>
  );
};
