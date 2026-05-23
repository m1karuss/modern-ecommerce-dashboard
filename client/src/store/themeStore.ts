import { create } from 'zustand';
import type { Theme, ThemeStore } from '../shared/types/theme.types';

const STORAGE_KEY = 'ecommerce-theme';

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return null;
};

const resolveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'system',
  resolvedTheme: 'light',

  setTheme: (theme: Theme) => {
    localStorage.setItem(STORAGE_KEY, theme);
    const resolved = resolveTheme(theme);

    set({ theme, resolvedTheme: resolved });

    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  initializeTheme: () => {
    const stored = getStoredTheme();
    const theme = stored || 'system';
    const resolved = resolveTheme(theme);

    set({ theme, resolvedTheme: resolved });

    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentTheme = get().theme;
      if (currentTheme === 'system') {
        const newResolved = getSystemTheme();
        set({ resolvedTheme: newResolved });

        if (newResolved === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
  },
}));
