import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="border-b border-gray-200 bg-white/90 backdrop-blur sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white font-bold">M</span>
                        <span className="font-semibold text-lg">MealPlanner</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm">
                        <Link to="/" className={`${isActive('/') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>Home</Link>
                        <Link to="/recipes" className={`${isActive('/recipes') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>Recipes</Link>
                        <Link to="/meal-planner" className={`${isActive('/meal-planner') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>Meal Planner</Link>
                        <Link to="/profile" className={`${isActive('/profile') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>Profile</Link>
                        <Link to="/add-recipe" className={`${isActive('/add-recipe') ? 'text-green-600 font-bold' : 'text-gray-700 hover:text-green-600'}`}>Add Recipe</Link>
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login" className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700">Login</Link>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-inset ring-gray-300 text-gray-700 hover:bg-gray-50">
                            <span className="block h-4 w-4">
                                <span className="block h-0.5 w-4 bg-gray-700"></span>
                                <span className="block h-0.5 w-4 bg-gray-700 mt-1"></span>
                                <span className="block h-0.5 w-4 bg-gray-700 mt-1"></span>
                            </span>
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col gap-4">
                            <Link to="/" className="text-gray-700 hover:text-green-600">Home</Link>
                            <Link to="/recipes" className="text-green-600 font-bold">Recipes</Link>
                            <Link to="/meal-planner" className="text-gray-700 hover:text-green-600">Meal Planner</Link>
                            <Link to="/profile" className="text-gray-700 hover:text-green-600">Profile</Link>
                            <Link to="/add-recipe" className="text-gray-700 hover:text-green-600">Add Recipe</Link>
                            <Link to="/login" className="text-gray-700 hover:text-green-600">Login</Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;