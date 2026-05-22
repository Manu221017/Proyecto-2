import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const THEME_KEY = 'app-theme';

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => localStorage.getItem(THEME_KEY) || 'light');

  const alternarTema = useCallback(() => {
    setTema((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem(THEME_KEY, tema);
  }, [tema]);

  useEffect(() => {
    function onTecla(e) {
      if (e.key !== 't' && e.key !== 'T') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      e.preventDefault();
      alternarTema();
    }

    window.addEventListener('keydown', onTecla);
    return () => window.removeEventListener('keydown', onTecla);
  }, [alternarTema]);

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
