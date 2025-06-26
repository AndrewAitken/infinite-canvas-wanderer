
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="glass-button-wrap">
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="glass-button"
      >
        <Sun className="h-6 w-6 glass-button-icon rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-6 w-6 glass-button-icon rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>
      <div className="glass-button-shadow"></div>
    </div>
  );
};

export default ThemeToggle;
