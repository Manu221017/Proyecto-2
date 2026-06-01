import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useAtajoTeclado } from '../hooks/useAtajoTeclado.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const ThemeContext = createContext(null);
const THEME_KEY = 'app-theme';

export function ThemeProvider({ children }) {
  const [tema, setTema] = useLocalStorage(THEME_KEY, 'light');

  const alternarTema = useCallback(() => {
    setTema((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTema]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
  }, [tema]);

  useAtajoTeclado('t', alternarTema);

  const value = useMemo(
    () => ({ tema, alternarTema, esOscuro: tema === 'dark' }),
    [tema, alternarTema]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return ctx;
}
