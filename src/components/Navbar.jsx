import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from 'react-icons/hi';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  logoutUser,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../redux/authSlice"; // Ensure this path is correct
import toast from "react-hot-toast";
import { useTheme } from "./Layout"; // Import useTheme from Layout

const Navbar = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Use theme from context
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      const query = searchQuery.trim();
      if (query) {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  const handleThemeToggle = () => {
    toggleTheme(); // Call toggleTheme from context
    toast.success(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode!`, { icon: theme === 'light' ? '🌙' : '☀️' });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // No action needed, search is now triggered automatically on debounce
  };

  return (
    <nav className="bg-slate-100 dark:bg-gray-800 text-gray-800 dark:text-slate-100 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300"
              >
                PasteBin
              </Link>
            </div>
            <div className="flex items-center space-x-2 ml-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-semibold px-3 py-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-800 transition-colors ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/pastes"
                className={({ isActive }) =>
                  `font-semibold px-3 py-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-800 transition-colors ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200"
                  }`
                }
              >
                Pastes
              </NavLink>
              <NavLink
                to="/blogs"
                className={({ isActive }) =>
                  `font-semibold px-3 py-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-800 transition-colors ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200"
                  }`
                }
              >
                Blogs
              </NavLink>
              <NavLink
                to="/chats"
                className={({ isActive }) =>
                  `font-semibold px-3 py-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-800 transition-colors ${
                    isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-200"
                  }`
                }
              >
                Chats
              </NavLink>
              {currentUser?.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                  onClick={handleMobileLinkClick}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/account"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                onClick={handleMobileLinkClick}
              >
                Account
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-shrink-0 hidden sm:block">
              <label htmlFor="search-navbar" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineSearch className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="search-navbar"
                  name="search"
                  className="block w-32 md:w-40 lg:w-48 pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-300 ease-in-out focus:w-40 md:focus:w-56"
                  placeholder="Search..."
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              {/* You can add a hidden submit button if needed, or rely on Enter key press for form submission */}
               <button type="submit" className="sr-only">Search</button> 
            </form>

            {/* Theme Toggle Button */}
            <button
              type="button"
              title="Toggle theme"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              onClick={handleThemeToggle}
              className="flex-shrink-0 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-300"
            >
              {theme === 'light' ? (
                <FiMoon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <FiSun className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            {/* User Actions (Desktop) */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 md:space-x-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
                    Hi, {currentUser?.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 transition-colors duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-300"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div className="lg:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={handleMobileLinkClick}
            >
              Home
            </Link>
            <Link
              to="/pastes"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={handleMobileLinkClick}
            >
              All Pastes
            </Link>
            <Link
              to="/blogs"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={handleMobileLinkClick}
            >
              All Blogs
            </Link>
            <Link
              to="/chats"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={handleMobileLinkClick}
            >
              Chats
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/pastes/create"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                  onClick={handleMobileLinkClick}
                >
                  Create Paste
                </Link>
                {currentUser?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                    onClick={handleMobileLinkClick}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/account"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                  onClick={handleMobileLinkClick}
                >
                  My Account
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Logged in as: {currentUser?.name} ({currentUser?.role})
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    handleMobileLinkClick();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-700 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-colors duration-300"
                onClick={handleMobileLinkClick}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
