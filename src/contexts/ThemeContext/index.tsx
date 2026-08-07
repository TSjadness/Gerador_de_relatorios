import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { ThemeProvider } from 'styled-components';
import { THEME_STORAGE_KEY } from '../../constants/diagnostic';
import { darkTheme, lightTheme } from '../../themes';
import { darkColors, lightColors } from '../../config/theme';

export type AppThemeMode = 'light' | 'dark';

type ThemeContextValue = {
  mode: AppThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: AppThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialMode(): AppThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'light';
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<AppThemeMode>(getInitialMode);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    document.documentElement.classList.toggle('app-dark', mode === 'dark');
    document.documentElement.style.colorScheme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? darkColors.header : lightColors.header);
  }, [mode]);

  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    toggleTheme: () => setMode((current) => current === 'light' ? 'dark' : 'light'),
    setTheme: setMode
  }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme precisa ser utilizado dentro de AppThemeProvider.');
  return context;
}
