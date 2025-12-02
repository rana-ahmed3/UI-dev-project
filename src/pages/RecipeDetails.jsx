import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { recipes } from '../data/recipes.js';

function RecipeDetails() {
  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-800">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Recipe not found</h1>
            <p className="mt-2 text-gray-600">We couldn&apos;t find the recipe you were looking for.</p>
            <Link to="/" className="mt-4 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800">
              ← Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <Navbar />
      <main className="py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Column 1: Title, Image, Meta */}
            <section className="md:col-span-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{recipe.title}</h1>
              {recipe.shortDescription && (
                <p className="mt-2 text-gray-600">{recipe.shortDescription}</p>
              )}
              {recipe.image && (
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
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
                    <div className="rounded-lg border border-gray-200 p-4">
                      <dt className="text-sm text-gray-600">Prep Time</dt>
                      <dd className="mt-1 font-semibold text-gray-900">{recipe.prepTime}</dd>
                    </div>
                  )}
                  {recipe.cookTime && (
                    <div className="rounded-lg border border-gray-200 p-4">
                      <dt className="text-sm text-gray-600">Cook Time</dt>
                      <dd className="mt-1 font-semibold text-gray-900">{recipe.cookTime}</dd>
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="rounded-lg border border-gray-200 p-4">
                      <dt className="text-sm text-gray-600">Servings</dt>
                      <dd className="mt-1 font-semibold text-gray-900">{recipe.servings}</dd>
                    </div>
                  )}
                </dl>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  Add to Meal Plan
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-50"
                >
                  Add to Favorites
                </button>
              </div>
            </section>

            {/* Column 2: Ingredients & Instructions */}
            <aside className="md:col-span-1">
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <section className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900">Ingredients</h2>
                  <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700 text-sm">
                    {recipe.ingredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {recipe.instructions && recipe.instructions.length > 0 && (
                <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900">Instructions</h2>
                  <ol className="mt-4 list-decimal list-inside space-y-3 text-gray-700 text-sm">
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


