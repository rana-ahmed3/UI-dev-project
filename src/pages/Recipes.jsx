import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecipe } from '../context/RecipeContext';
import Loading from '../components/common/Loading.jsx';

const Recipes = () => {
  const [filters, setFilters] = useState({
    cuisine: '',
    mealType: '',
    dietary: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);
  const recipesPerPage = 4;

  // Toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [removedIds, setRemovedIds] = useState([]);
  const [deletingRecipeId, setDeletingRecipeId] = useState(null); // Track which recipe is being deleted

  // API states
  const [apiRecipes, setApiRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use RecipeContext for favorites and custom recipes
  const { 
    favorites = [], 
    toggleFavorite = () => {}, 
    isFavorite = () => false, 
    customRecipes = [], 
    deleteCustomRecipe = () => {}
  } = useRecipe() || {};

  // Fetch all recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);
      const startTime = Date.now();
      const minLoadingTime = 500; // Minimum 500ms to show loading
      
      try {
        const response = await fetch('http://localhost:3001/recipes');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setApiRecipes(data);
      } catch (err) {
        console.error('Failed to fetch recipes:', err);
        setError('Failed to load recipes. Please try again later.');
        setApiRecipes([]); // Set empty array on error
      } finally {
        // Ensure minimum loading time
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadingTime - elapsed);
        setTimeout(() => {
          setIsLoading(false);
        }, remaining);
      }
    };

    fetchRecipes();
  }, []);

  // Merge all recipes: API + custom
  const recipes = useMemo(() => {
    // Convert API recipes to our format
    const convertedApiRecipes = apiRecipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name || recipe.title,
      time: recipe.time || recipe.cookTime || recipe.prepTime || 'N/A',
      difficulty: recipe.difficulty || 'Medium',
      image: recipe.image,
      cuisine: recipe.cuisine || recipe.cuisineType || 'Other',
      mealType: recipe.mealType || 'Dinner',
      dietary: recipe.dietary || recipe.dietaryRestrictions || []
    }));

    // Convert custom recipes to our format
    const convertedCustomRecipes = customRecipes.map(recipe => ({
      id: recipe.id,
      name: recipe.name || recipe.title,
      time: recipe.time || 'N/A',
      difficulty: recipe.difficulty || 'Medium',
      image: recipe.image,
      cuisine: recipe.cuisine || recipe.cuisineType || 'Other',
      mealType: recipe.mealType || 'Dinner',
      dietary: recipe.dietary || recipe.dietaryRestrictions || []
    }));

    const all = [...convertedApiRecipes, ...convertedCustomRecipes];
    // Filter out any ids that were optimistically removed
    return all.filter(r => !removedIds.includes(r.id));
  }, [apiRecipes, customRecipes, removedIds]);

  // Delete recipe handler
  const handleDeleteRecipe = (recipeId, recipeName) => {
    setRecipeToDelete({ id: recipeId, name: recipeName });
    setToastMessage(`Are you sure you want to delete "${recipeName}"?`);
    setToastType('warning');
    setShowToast(true);
  };

  // Confirm delete recipe
  const confirmDelete = async () => {
    if (!recipeToDelete) return;
    
    setDeletingRecipeId(recipeToDelete.id); // Set loading state
    // Keep modal open to show loading state
    
    // Check if this is a custom recipe
    const isCustom = customRecipes.some(r => r.id === recipeToDelete.id);
    
    try {
      // Add minimum delay to show loading state
      const deletePromise = (async () => {
        if (isCustom) {
          // Delete custom recipe from context
          deleteCustomRecipe(recipeToDelete.id);
          
          // Also try to delete from API if it exists there
          try {
            await fetch(`http://localhost:3000/recipes/${recipeToDelete.id}`, {
              method: 'DELETE'
            });
          } catch (apiErr) {
            console.log('Custom recipe not in API, deleted from context only');
          }
        } else {
          // Delete from API (regular recipe)
          const response = await fetch(`http://localhost:3000/recipes/${recipeToDelete.id}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) {
            throw new Error('Failed to delete recipe from server');
          }
          
          // Remove from local API state
          setApiRecipes(prev => prev.filter(r => r.id !== recipeToDelete.id));
        }
      })();
      
      // Wait for both delete operation and minimum delay
      await Promise.all([
        deletePromise,
        new Promise(resolve => setTimeout(resolve, 800)) // Minimum 800ms loading
      ]);
      
      // Optimistically remove from UI after loading is visible
      setRemovedIds(prev => [...prev, recipeToDelete.id]);
      
      setToastMessage(`"${recipeToDelete.name}" deleted successfully!`);
      setToastType('success');
      
      // Close modal and show success message
      setShowToast(true);
    } catch (err) {
      console.error('Error deleting recipe:', err);
      
      if (isCustom && err.message.includes('Failed to delete recipe from server')) {
        // API failed but custom recipe was deleted from context
        setToastMessage(`"${recipeToDelete.name}" removed from your recipes`);
        setToastType('success');
        setRemovedIds(prev => [...prev, recipeToDelete.id]);
        setShowToast(true);
      } else {
        setToastMessage('Failed to delete recipe. Please try again.');
        setToastType('error');
        setShowToast(true);
      }
    } finally {
      setDeletingRecipeId(null); // Clear loading state
      setRecipeToDelete(null);
    }
  };

  // Cancel delete recipe
  const cancelDelete = () => {
    setRecipeToDelete(null);
    setToastMessage('Deletion cancelled');
    setToastType('info');
    setShowToast(true);
  };

  // Toast auto-hide
  useEffect(() => {
    if (showToast && (toastType === 'success' || toastType === 'error' || toastType === 'info')) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast, toastType]);

  // Convert time string to minutes
  const convertTimeToMinutes = (timeString) => {
    if (!timeString) return 0;
    const time = timeString.toLowerCase();

    if (time.includes('hr') && time.includes('min')) {
      const parts = time.split(' ');
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[2]) || 0;
      return hours * 60 + minutes;
    }

    if (time.includes('hr')) {
      const hours = parseInt(time) || 0;
      return hours * 60;
    }

    if (time.includes('min')) {
      return parseInt(time) || 0;
    }

    return 0;
  };

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe => {
      // Show favorites filter
      if (showFavorites && !isFavorite(recipe.id)) {
        return false;
      }

      // Search
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

      // Cuisine
      const matchesCuisine = !filters.cuisine || recipe.cuisine === filters.cuisine;

      // Meal type
      const matchesMealType = !filters.mealType || recipe.mealType === filters.mealType;

      // Dietary
      const matchesDietary = filters.dietary.length === 0 ||
                            filters.dietary.every(diet => recipe.dietary.includes(diet));

      return matchesSearch && matchesCuisine && matchesMealType && matchesDietary;
    });

    // Sort recipes
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => {
          const aFav = isFavorite(a.id);
          const bFav = isFavorite(b.id);
          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;
          return b.id - a.id;
        });
        break;
      case 'cookTime':
        filtered.sort((a, b) => {
          const timeA = convertTimeToMinutes(a.time);
          const timeB = convertTimeToMinutes(b.time);
          return timeA - timeB;
        });
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  }, [recipes, filters, searchTerm, sortBy, showFavorites, isFavorite]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRecipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const currentRecipes = filteredAndSortedRecipes.slice(startIndex, startIndex + recipesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setFilters({ cuisine: '', mealType: '', dietary: [] });
    setSearchTerm('');
    setShowFavorites(false);
    setCurrentPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 py-8">
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="sticky top-28 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h3>
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex flex-col gap-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
            {/* Search bar skeleton */}
            <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            {/* Recipe cards skeleton - matches actual recipe card layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex flex-col gap-3">
                  {/* Image skeleton - matches aspect-[4/3] */}
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="w-full aspect-[4/3] bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse"></div>
                    {/* Favorite button skeleton */}
                    <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"></div>
                    {/* Delete button skeleton */}
                    <div className="absolute top-3 left-3 h-8 w-8 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"></div>
                  </div>
                  {/* Text content skeleton */}
                  <div className="flex flex-col gap-2">
                    {/* Title skeleton */}
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                    {/* Time and difficulty skeleton */}
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 py-8">
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="sticky top-28 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h3>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded opacity-50"></div>
              ))}
            </div>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-red-500 dark:text-red-400 mb-4">
              error
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Failed to Load Recipes</h2>
            <p className="text-slate-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast for deleting message */}
      {showToast && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {toastType === 'warning' ? (deletingRecipeId ? 'Deleting Recipe...' : 'Confirm Delete') : 'Success'}
            </h3>
            <p className="text-slate-600 dark:text-gray-400 mb-4">{toastMessage}</p>
            {toastType === 'warning' && (
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={deletingRecipeId !== null}
                  className="px-4 py-2 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingRecipeId !== null}
                  className={`px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    deletingRecipeId !== null ? 'cursor-wait' : ''
                  }`}
                >
                  {deletingRecipeId !== null ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* sidebar Filters */}
      <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
        <div className="sticky top-28 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h3>

          {/* favorites filter */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setShowFavorites(!showFavorites);
                setCurrentPage(1);
              }}
              className={`w-full px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${showFavorites
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium'
                : 'bg-slate-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-400'
                }`}
            >
              <span className="material-symbols-outlined text-xl">
                favorite
              </span>
              Show Favorites ({favorites.length})
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-600 dark:text-gray-400">Cuisine</h4>
            <div className="flex flex-wrap gap-2">
              {['Italian', 'Mexican', 'Japanese', 'Indian', 'American', 'Mediterranean', 'Asian'].map(cuisine => (
                <button
                  key={cuisine}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, cuisine }));
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-sm rounded-full ${filters.cuisine === cuisine
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                    : 'bg-slate-200 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900/30 text-slate-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400'
                    }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-600 dark:text-gray-400">Meal Type</h4>
            <div className="flex flex-wrap gap-2">
              {['Breakfast', 'Lunch', 'Dinner', 'Dessert'].map(mealType => (
                <button
                  key={mealType}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, mealType }));
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-sm rounded-full ${filters.mealType === mealType
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'bg-slate-200 hover:bg-green-100 text-slate-700 hover:text-green-700'
                    }`}
                >
                  {mealType}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-600 dark:text-gray-400">Dietary</h4>
            <div className="flex flex-wrap gap-2">
              {['Vegetarian', 'Vegan', 'Gluten-Free'].map(diet => (
                <button
                  key={diet}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      dietary: prev.dietary.includes(diet)
                        ? prev.dietary.filter(d => d !== diet)
                        : [...prev.dietary, diet]
                    }));
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-sm rounded-full ${filters.dietary.includes(diet)
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium'
                    : 'bg-slate-200 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900/30 text-slate-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400'
                    }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="w-full text-center text-sm font-medium text-slate-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
          >
            Clear Filters
          </button>
        </div>
      </aside>

      {/* main Content */}
      <div className="flex-1 min-w-0">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
              {showFavorites ? 'Favorite Recipes' : 'Discover Recipes'}
            </h1>
            <p className="text-slate-600 dark:text-gray-400">
              {showFavorites
                ? 'Your saved favorite recipes'
                : `Explore ${recipes.length} recipes from our collection.`
              }
            </p>
          </div>

          <div className="sticky top-[73px] z-10 bg-green-50 dark:bg-gray-800 py-4 -my-4">
            <div className="flex w-full items-stretch rounded-xl h-14 shadow-sm bg-white dark:bg-gray-700">
              <div className="text-green-600 flex items-center justify-center pl-4 rounded-l-xl">
                <span className="material-symbols-outlined text-2xl">search</span>
              </div>
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 border-none bg-transparent h-full placeholder:text-slate-400 dark:placeholder:text-gray-500 px-4 rounded-l-none pl-2 text-base font-normal leading-normal"
                placeholder="Search for recipes, ingredients, or keywords..."
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Showing {currentRecipes.length} of {filteredAndSortedRecipes.length} recipes
              {apiRecipes.length > 0 && ` (${apiRecipes.length} from API)`}
              {customRecipes.length > 0 && ` (${customRecipes.length} custom)`}
            </p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="popular">Sort by: Popular</option>
                <option value="cookTime">Sort by: Cook Time</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-lg pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentRecipes.map(recipe => {
              const isDeleting = deletingRecipeId === recipe.id;
              return (
                <div key={recipe.id} className={`flex flex-col gap-3 ${isDeleting ? 'opacity-60' : ''}`}>
                  <Link
                    to={`/recipe/${recipe.id}`}
                    className="flex flex-col gap-3 group cursor-pointer block"
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <div
                        className="w-full bg-center bg-cover aspect-[4/3] rounded-xl transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundImage: `url(${recipe.image})` }}
                      ></div>
                      {!isDeleting && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(recipe.id);
                          }}
                          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
                        >
                          <span
                            className={`material-symbols-outlined text-xl ${isFavorite(recipe.id) ? 'text-red-500' : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
                              }`}
                            style={isFavorite(recipe.id) ? { fontVariationSettings: "'FILL' 1" } : {}}
                          >
                            favorite
                          </span>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteRecipe(recipe.id, recipe.name);
                        }}
                        disabled={isDeleting}
                        className={`absolute top-3 left-3 h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center transition-colors z-10 hover:bg-red-50 dark:hover:bg-red-900/30 ${
                          isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Delete recipe"
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                        ) : (
                          <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-400 hover:text-red-500">
                            delete
                          </span>
                        )}
                      </button>
                      {isDeleting && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 rounded-xl">
                          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Deleting...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white text-base font-bold leading-normal group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {recipe.name}
                      </p>
                      <p className="text-slate-500 dark:text-gray-400 text-sm font-normal leading-normal">
                        {recipe.time} • {recipe.difficulty}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {currentRecipes.length === 0 && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-gray-600 mb-4">
                restaurant
              </span>
              <p className="text-slate-500 dark:text-gray-400 text-lg">No recipes found</p>
              <p className="text-slate-400 dark:text-gray-500">Try changing your filters or search term</p>
            </div>
          )}

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center pt-8">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm ${currentPage === page
                          ? 'bg-green-600 text-white font-bold'
                          : 'bg-white dark:bg-gray-700 text-slate-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="text-slate-500 dark:text-gray-400">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center h-9 w-9 rounded-lg bg-white dark:bg-gray-700 border border-slate-300 dark:border-gray-600 text-slate-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;