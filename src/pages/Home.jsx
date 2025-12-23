import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import RecipeCard from '../components/RecipeCard.jsx';

function Home() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3001/recipes');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        // Take first 4 recipes as featured
        setFeaturedRecipes(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch featured recipes:', err);
        setFeaturedRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedRecipes();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-900 to-emerald-700" />
        <div
          className="absolute inset-0 -z-10"
          style={{
            opacity: 0.18,
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,.35) 0, rgba(255,255,255,0) 40%), radial-gradient(circle at 80% 30%, rgba(255,255,255,.28) 0, rgba(255,255,255,0) 35%), radial-gradient(circle at 30% 80%, rgba(255,255,255,.22) 0, rgba(255,255,255,0) 30%)',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-black/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 sm:py-28 lg:py-36 text-white">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl">
              Plan Your Meals, Simplify Your Life
            </h1>
            <p className="mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-white/95">
              Discover recipes, organize your weekly meal plan, and make grocery shopping effortless with
              MealPlanner.
            </p>
            <div className="mt-8">
              <Link
                to="/recipes"
                className="inline-flex items-center rounded-md bg-emerald-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">How it Works</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Three simple steps to take control of your meals.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Link
              to="/recipes"
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
            >
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Search Recipes</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                Find delicious recipes tailored to your tastes and dietary preferences.
              </p>
            </Link>
            <Link
              to="/meal-planner"
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
            >
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Plan Your Week</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                Organize meals into an easy, balanced plan for your week.
              </p>
            </Link>
            <Link
              to="/recipes"
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer block"
            >
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Cook &amp; Enjoy</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                Follow step-by-step instructions and enjoy stress-free cooking.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Featured Recipes</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Curated ideas to inspire your next meal.</p>
            </div>
            <Link
              to="/recipes"
              className="hidden sm:inline-flex text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
            >
              Browse all →
            </Link>
          </div>

          {isLoading ? (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : featuredRecipes.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredRecipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No featured recipes available</p>
              <Link
                to="/recipes"
                className="mt-4 inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                Browse all recipes →
              </Link>
            </div>
          )}
        </div>
      </section>

       {/* <Footer />*/}
    </div>
  );
}

export default Home;