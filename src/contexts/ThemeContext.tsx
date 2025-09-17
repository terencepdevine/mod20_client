import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type BackgroundColorFamily = 'gray' | 'slate' | 'zinc' | 'neutral' | 'stone';
export type PrimaryColorFamily = 'blue' | 'indigo' | 'purple' | 'green' | 'red' | 'orange' | 'yellow' | 'teal' | 'cyan' | 'sky';

interface ThemeContextType {
  theme: Theme;
  backgroundColorFamily: BackgroundColorFamily;
  primaryColorFamily: PrimaryColorFamily;
  isPreviewMode: boolean;
  toggleTheme: () => void;
  setBackgroundColorFamily: (family: BackgroundColorFamily) => void;
  setPrimaryColorFamily: (family: PrimaryColorFamily) => void;
  setPreviewMode: (isPreview: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'dark';
  });

  const [backgroundColorFamily, setBackgroundColorFamilyState] = useState<BackgroundColorFamily>('gray');
  const [primaryColorFamily, setPrimaryColorFamilyState] = useState<PrimaryColorFamily>('blue');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bg-family', backgroundColorFamily);
    document.documentElement.setAttribute('data-primary-family', primaryColorFamily);
  }, [theme, backgroundColorFamily, primaryColorFamily]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setBackgroundColorFamily = (family: BackgroundColorFamily) => {
    setBackgroundColorFamilyState(family);
  };

  const setPrimaryColorFamily = (family: PrimaryColorFamily) => {
    setPrimaryColorFamilyState(family);
  };

  const setPreviewMode = (isPreview: boolean) => {
    setIsPreviewMode(isPreview);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      backgroundColorFamily,
      primaryColorFamily,
      isPreviewMode,
      toggleTheme,
      setBackgroundColorFamily,
      setPrimaryColorFamily,
      setPreviewMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};