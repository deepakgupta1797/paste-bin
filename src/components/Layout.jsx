import React, { createContext, useState, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

// Creating Theme Context
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Custom hook to use the theme context easily
export const useTheme = () => useContext(ThemeContext);

const Layout = () => {
  //  Manage Theme State
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    // Ensure Tailwind's dark mode is 'class' and this matches
    return storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    // Apply theme class to HTML element and store in localStorage
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-neutral-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export default Layout;