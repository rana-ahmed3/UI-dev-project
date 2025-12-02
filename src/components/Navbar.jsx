import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
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
            <Link to="/" className="text-green-600 font-bold">
              Home
            </Link>
            {/* External links preserved as anchors pointing to original HTML pages */}
            <a href="SRC/list_page.html" className="text-gray-700 hover:text-green-600">
              Recipes
            </a>
            <a href="Dashboard_Page.html" className="text-gray-700 hover:text-green-600">
              Meal Planner
            </a>
            <a href="profile_page.html" className="text-gray-700 hover:text-green-600">
              Profile
            </a>
            <a href="SRC/form_page.html" className="text-gray-700 hover:text-green-600">
              Add Recipe
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a
              href="index.html"
              className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Login
            </a>
          </div>
          {/* Mobile menu toggle is omitted in React version for simplicity */}
        </div>
      </div>
    </header>
  );
}

export default Navbar;


