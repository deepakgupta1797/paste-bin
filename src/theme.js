const THEME_KEY = 'theme';

export function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'; // Default for SSR or non-browser

  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    return storedTheme;
  }

  const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
  if (userMedia.matches) {
    return 'dark';
  }

  return 'light'; // Default theme
}

export function applyTheme(theme) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }
}

export function setTheme(theme) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function toggleTheme() {
  if (typeof window === 'undefined') return;
  const currentTheme = localStorage.getItem(THEME_KEY) || getInitialTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}