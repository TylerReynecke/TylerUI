import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useUITheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useUITheme must be used within a ThemeProvider');
  return context;
};

// Helper to convert hex to RGBA values for soft colors and shadow effects
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper to darken a hex color for hover states
const darkenColor = (hex: string, percent: number): string => {
  let num = parseInt(hex.replace("#",""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) - amt,
      G = (num >> 8 & 0x00FF) - amt,
      B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  const [primaryColor, setPrimaryColor] = useState<string>('#3b82f6'); // Default brand blue
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Injects dynamic brand styling overrides onto the root element
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--ui-primary', primaryColor);
    root.style.setProperty('--ui-primary-deep', darkenColor(primaryColor, 12));
    root.style.setProperty('--ui-primary-soft', hexToRgba(primaryColor, 0.12));
    root.style.setProperty('--ui-primary-shadow', hexToRgba(primaryColor, 0.3));
  }, [primaryColor]);

  // Synchronize theme classes on document root and body for React Portals support
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      const activeTheme = theme === 'system' 
        ? (mediaQuery.matches ? 'dark' : 'light') 
        : theme;
      setResolvedTheme(activeTheme);
    };

    updateTheme();

    if (theme === 'system') {
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', updateTheme);
      } else {
        mediaQuery.addListener(updateTheme);
      }
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', updateTheme);
        } else {
          mediaQuery.removeListener(updateTheme);
        }
      };
    }
  }, [theme]);

  // Apply resolvedTheme class to DOM elements
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${resolvedTheme}`);
    
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${resolvedTheme}`);
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, primaryColor, setPrimaryColor }}>
      <div className={`theme-${resolvedTheme}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
