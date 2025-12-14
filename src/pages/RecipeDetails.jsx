import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { recipes as defaultRecipes } from '../data/recipes.js';
import { useRecipe } from '../context/RecipeContext';

function RecipeDetails() {
  const { id } = useParams();
  const { toggleFavorite, addToMealPlan, isFavorite, isInMealPlan, customRecipes } = useRecipe();

  // Hardcoded recipes (same as in Recipes page)
  const hardcodedRecipes = [
    { id: 1, name: "Spaghetti Carbonara", time: "30 min", difficulty: "Easy", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop", cuisine: "Italian", mealType: "Dinner", dietary: [] },
    { id: 2, name: "Margherita Pizza", time: "25 min", difficulty: "Medium", image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop", cuisine: "Italian", mealType: "Dinner", dietary: ["Vegetarian"] },
    { id: 3, name: "Tiramisu", time: "240 min", difficulty: "Medium", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop", cuisine: "Italian", mealType: "Dessert", dietary: ["Vegetarian"] },
    { id: 4, name: "Vegetarian Chili", time: "45 min", difficulty: "Medium", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop", cuisine: "Mexican", mealType: "Dinner", dietary: ["Vegetarian", "Vegan"] },
    { id: 5, name: "Chicken Tacos", time: "20 min", difficulty: "Easy", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop", cuisine: "Mexican", mealType: "Lunch", dietary: [] },
    { id: 6, name: "Guacamole", time: "10 min", difficulty: "Easy", image: "https://tse2.mm.bing.net/th/id/OIP.UOvGjJSHgnMC9xGI5V1LeQHaLH?pid=Api&P=0&h=220", cuisine: "Mexican", mealType: "Lunch", dietary: ["Vegetarian", "Vegan", "Gluten-Free"] },
    { id: 7, name: "Sushi Rolls", time: "40 min", difficulty: "Hard", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop", cuisine: "Japanese", mealType: "Dinner", dietary: [] },
    { id: 8, name: "Ramen", time: "60 min", difficulty: "Medium", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop", cuisine: "Japanese", mealType: "Dinner", dietary: [] },
    { id: 9, name: "Miso Soup", time: "15 min", difficulty: "Easy", image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop", cuisine: "Japanese", mealType: "Lunch", dietary: ["Vegetarian", "Vegan", "Gluten-Free"] },
    { id: 10, name: "Butter Chicken", time: "50 min", difficulty: "Medium", image: "https://tse2.mm.bing.net/th/id/OIP.hcWbNbOAci5jAXs1OPrs1AHaLH?pid=Api&P=0&h=220", cuisine: "Indian", mealType: "Dinner", dietary: [] },
    { id: 11, name: "Vegetable Curry", time: "35 min", difficulty: "Easy", image: "https://tse1.mm.bing.net/th/id/OIP.FpPegBKiiWT35VbixpAX1QHaKt?pid=Api&P=0&h=220", cuisine: "Indian", mealType: "Dinner", dietary: ["Vegetarian", "Vegan"] },
    { id: 12, name: "Chana Masala", time: "30 min", difficulty: "Medium", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop", cuisine: "Indian", mealType: "Lunch", dietary: ["Vegetarian", "Vegan", "Gluten-Free"] },
    { id: 13, name: "Classic Chicken Soup", time: "60 min", difficulty: "Easy", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop", cuisine: "American", mealType: "Lunch", dietary: [] },
    { id: 14, name: "Avocado Toast", time: "10 min", difficulty: "Easy", image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop", cuisine: "American", mealType: "Breakfast", dietary: ["Vegetarian", "Vegan"] },
    { id: 15, name: "Fluffy Pancakes", time: "20 min", difficulty: "Easy", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop", cuisine: "American", mealType: "Breakfast", dietary: ["Vegetarian"] },
    { id: 16, name: "Chocolate Cake", time: "90 min", difficulty: "Medium", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop", cuisine: "American", mealType: "Dessert", dietary: ["Vegetarian"] },
    { id: 17, name: "Lemon Herb Salmon", time: "25 min", difficulty: "Medium", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop", cuisine: "Mediterranean", mealType: "Dinner", dietary: [] },
    { id: 18, name: "Quinoa Salad", time: "20 min", difficulty: "Easy", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", cuisine: "Mediterranean", mealType: "Lunch", dietary: ["Vegetarian", "Vegan", "Gluten-Free"] },
    { id: 19, name: "Greek Salad", time: "15 min", difficulty: "Easy", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop", cuisine: "Mediterranean", mealType: "Lunch", dietary: ["Vegetarian", "Gluten-Free"] },
    { id: 20, name: "Hummus", time: "10 min", difficulty: "Easy", image: "https://tse3.mm.bing.net/th/id/OIP.k_F_vG59BmBJ0Hx3G64uTgHaKc?pid=Api&P=0&h=220", cuisine: "Mediterranean", mealType: "Lunch", dietary: ["Vegetarian", "Vegan", "Gluten-Free"] }
  ];

  // Find recipe from all sources
  const recipe = useMemo(() => {
    // First check hardcoded recipes
    const hardcoded = hardcodedRecipes.find((r) => String(r.id) === String(id));
    if (hardcoded) {
      return {
        id: hardcoded.id,
        title: hardcoded.name,
        name: hardcoded.name,
        shortDescription: `${hardcoded.cuisine} ${hardcoded.mealType}`,
        image: hardcoded.image,
        prepTime: hardcoded.time,
        cookTime: hardcoded.time,
        servings: '4',
        ingredients: ['Ingredients not available for this recipe'],
        instructions: ['Instructions not available for this recipe']
      };
    }

    // Then check default recipes
    const defaultRecipe = defaultRecipes.find((r) => String(r.id) === String(id));
    if (defaultRecipe) {
      return defaultRecipe;
    }

    // Finally check custom recipes
    const customRecipe = customRecipes.find((r) => String(r.id) === String(id));
    if (customRecipe) {
      return {
        ...customRecipe,
        title: customRecipe.title || customRecipe.name,
        shortDescription: customRecipe.shortDescription || customRecipe.description || ''
      };
    }

    return null;
  }, [id, customRecipes]);

  const favorite = isFavorite(id);
  const inMealPlan = isInMealPlan(id);

  const handleAddToMealPlan = () => {
    if (recipe) {
      addToMealPlan(id);
      alert(`${recipe.title || recipe.name} has been added to your meal plan!`);
    }
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


