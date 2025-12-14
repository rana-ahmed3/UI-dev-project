import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 dark:bg-emerald-600 text-white font-bold">
              M
            </span>
            <span className="font-semibold text-lg text-gray-900 dark:text-white">MealPlanner</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link to="/" className={isActive('/') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'}>
              Home
            </Link>
            <Link to="/recipes" className={isActive('/recipes') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'}>
              Recipes
            </Link>
            <Link to="/meal-planner" className={isActive('/meal-planner') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'}>
              Meal Planner
            </Link>
            <Link to="/profile" className={isActive('/profile') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'}>
              Profile
            </Link>
            <Link to="/add-recipe" className={isActive('/add-recipe') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'}>
              Add Recipe
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            <Link
              to="/login"
              className="inline-flex items-center rounded-md bg-emerald-600 dark:bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Login
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-inset ring-gray-300 dark:ring-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              <span className="block h-4 w-4">
                <span className={`block h-0.5 w-4 bg-gray-700 dark:bg-gray-300 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 w-4 bg-gray-700 dark:bg-gray-300 mt-1 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-4 bg-gray-700 dark:bg-gray-300 mt-1 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${isActive('/') ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                Home
              </Link>
              <Link
                to="/recipes"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${isActive('/recipes') ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                Recipes
              </Link>
              <Link
                to="/meal-planner"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${isActive('/meal-planner') ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                Meal Planner
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${isActive('/profile') ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                Profile
              </Link>
              <Link
                to="/add-recipe"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${isActive('/add-recipe') ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30' : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                Add Recipe
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-md bg-emerald-600 dark:bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:hover:bg-emerald-600"
              >
                Login
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;


