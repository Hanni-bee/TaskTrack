import { useState, useEffect } from 'react';
import { safeStorage } from '../utils/safeStorage';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = safeStorage.getItem('theme') as Theme;
    return stored || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

  useEffect(() => {
    const root = document.documentElement;
    
    const getSystemTheme = (): ResolvedTheme => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const updateTheme = (newTheme: Theme) => {
      let resolved: ResolvedTheme;
      
      if (newTheme === 'system') {
        resolved = getSystemTheme();
      } else {
        resolved = newTheme;
      }

      setResolvedTheme(resolved);
      
      // Update CSS classes
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      
      // Update CSS custom properties
      if (resolved === 'dark') {
        root.style.setProperty('--bg-primary', '#0f172a');
        root.style.setProperty('--bg-secondary', '#1e293b');
        root.style.setProperty('--bg-tertiary', '#334155');
        root.style.setProperty('--text-primary', '#f1f5f9');
        root.style.setProperty('--text-secondary', '#cbd5e1');
        root.style.setProperty('--text-tertiary', '#94a3b8');
        root.style.setProperty('--border-color', '#475569');
        root.style.setProperty('--glass-bg', 'rgba(30, 41, 59, 0.7)');
        root.style.setProperty('--glass-border', 'rgba(148, 163, 184, 0.2)');
      } else {
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8fafc');
        root.style.setProperty('--bg-tertiary', '#e2e8f0');
        root.style.setProperty('--text-primary', '#0f172a');
        root.style.setProperty('--text-secondary', '#334155');
        root.style.setProperty('--text-tertiary', '#64748b');
        root.style.setProperty('--border-color', '#cbd5e1');
        root.style.setProperty('--glass-bg', 'rgba(248, 250, 252, 0.7)');
        root.style.setProperty('--glass-border', 'rgba(100, 116, 139, 0.2)');
      }
    };

    updateTheme(theme);
    safeStorage.setItem('theme', theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        updateTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme: () => {
      setTheme(current => current === 'dark' ? 'light' : 'dark');
    }
  };
}
