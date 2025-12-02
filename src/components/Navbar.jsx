import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold">
              M
            </span>
            <span className="font-semibold text-lg">MealPlanner</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link to="/" className={isActive('/') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}>
              Home
            </Link>
            <Link to="/recipes" className={isActive('/recipes') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}>
              Recipes
            </Link>
            <Link to="/meal-planner" className={isActive('/meal-planner') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}>
              Meal Planner
            </Link>
            <Link to="/profile" className={isActive('/profile') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}>
              Profile
            </Link>
            <Link to="/add-recipe" className={isActive('/add-recipe') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}>
              Add Recipe
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Login
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-inset ring-gray-300 text-gray-700 hover:bg-gray-50"
              aria-label="Toggle menu"
            >
              <span className="block h-4 w-4">
                <span className={`block h-0.5 w-4 bg-gray-700 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 w-4 bg-gray-700 mt-1 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-4 bg-gray-700 mt-1 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${isActive('/') ? 'text-green-600 font-bold bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'}`}
              >
                Home
              </Link>
              <Link
                to="/recipes"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${isActive('/recipes') ? 'text-green-600 font-bold bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'}`}
              >
                Recipes
              </Link>
              <Link
                to="/meal-planner"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${isActive('/meal-planner') ? 'text-green-600 font-bold bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'}`}
              >
                Meal Planner
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${isActive('/profile') ? 'text-green-600 font-bold bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'}`}
              >
                Profile
              </Link>
              <Link
                to="/add-recipe"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm ${isActive('/add-recipe') ? 'text-green-600 font-bold bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'}`}
              >
                Add Recipe
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
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


