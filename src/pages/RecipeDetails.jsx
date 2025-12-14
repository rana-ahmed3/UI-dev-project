import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { recipes } from '../data/recipes.js';
import { useRecipe } from '../context/RecipeContext';

function RecipeDetails() {
  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === id);
  const { toggleFavorite, addToMealPlan, isFavorite, isInMealPlan } = useRecipe();

  const favorite = isFavorite(id);
  const inMealPlan = isInMealPlan(id);

  const handleAddToMealPlan = () => {
    addToMealPlan(id);
    alert(`${recipe.title} has been added to your meal plan!`);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(id);
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recipe not found</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">We couldn&apos;t find the recipe you were looking for.</p>
            <Link to="/" className="mt-4 inline-flex text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
              ← Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Navbar />
      <main className="py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Column 1: Title, Image, Meta */}
            <section className="md:col-span-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{recipe.title}</h1>
              {recipe.shortDescription && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">{recipe.shortDescription}</p>
              )}
              {recipe.image && (
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              {(recipe.prepTime || recipe.cookTime || recipe.servings) && (
                <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recipe.prepTime && (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                      <dt className="text-sm text-gray-600 dark:text-gray-400">Prep Time</dt>
                      <dd className="mt-1 font-semibold text-gray-900 dark:text-white">{recipe.prepTime}</dd>
                    </div>
                  )}
                  {recipe.cookTime && (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                      <dt className="text-sm text-gray-600 dark:text-gray-400">Cook Time</dt>
                      <dd className="mt-1 font-semibold text-gray-900 dark:text-white">{recipe.cookTime}</dd>
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                      <dt className="text-sm text-gray-600 dark:text-gray-400">Servings</dt>
                      <dd className="mt-1 font-semibold text-gray-900 dark:text-white">{recipe.servings}</dd>
                    </div>
                  )}
                </dl>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAddToMealPlan}
                  disabled={inMealPlan}
                  className={`inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    inMealPlan
                      ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                      : 'bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600'
                  }`}
                >
                  {inMealPlan ? 'Already in Meal Plan' : 'Add to Meal Plan'}
                </button>
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={`inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    favorite
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 ring-red-600/20 dark:ring-red-500/30 hover:bg-red-100 dark:hover:bg-red-900/30'
                      : 'bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 ring-emerald-600/20 dark:ring-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                  }`}
                >
                  {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </section>

            {/* Column 2: Ingredients & Instructions */}
            <aside className="md:col-span-1">
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ingredients</h2>
                  <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    {recipe.ingredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {recipe.instructions && recipe.instructions.length > 0 && (
                <section className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Instructions</h2>
                  <ol className="mt-4 list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                    {recipe.instructions.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </section>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default RecipeDetails;


