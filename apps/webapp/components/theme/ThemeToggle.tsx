'use client';

import { Button, PaletteMode } from '@mui/material';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Dispatch, SetStateAction } from 'react';

export type ThemeToggleProps = {
  setThemeMode: Dispatch<SetStateAction<PaletteMode>>;
  themeMode: PaletteMode;
};

export default function ThemeToggle({ setThemeMode, themeMode }: ThemeToggleProps) {
  const isDarkTheme = themeMode === 'dark';

  return (
    <Button
      onClick={() => setThemeMode(isDarkTheme ? 'light' : 'dark')}
      sx={{
        borderRadius: '50%',
        width: 48,
        height: 48,
        minWidth: 0,
        padding: 0,
      }}
      color="secondary"
    >
      {isDarkTheme ? <SunIcon height={24} width={24} /> : <MoonIcon height={24} width={24} />}
    </Button>
  );
}
