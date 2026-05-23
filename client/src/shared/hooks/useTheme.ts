import { useThemeStore } from '../../store/themeStore';

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return {
    theme,
    resolvedTheme,
    setTheme,
  };
}
