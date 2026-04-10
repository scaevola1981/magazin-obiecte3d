'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  reducedMotion: false,
  toggleReducedMotion: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Init theme
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light-mode');
    }

    // Init reduced motion
    const savedMotion = localStorage.getItem('reducedMotion');
    if (savedMotion === 'true') {
      setReducedMotion(true);
      document.documentElement.classList.add('reduced-motion');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  };

  const toggleReducedMotion = () => {
    const newMotion = !reducedMotion;
    setReducedMotion(newMotion);
    localStorage.setItem('reducedMotion', String(newMotion));
    
    if (newMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, reducedMotion, toggleReducedMotion }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
