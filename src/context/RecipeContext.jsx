import React, { createContext, useContext, useState, useEffect } from 'react';

const RecipeContext = createContext();

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  // Initialize favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Initialize mealPlan from localStorage
  const [mealPlan, setMealPlan] = useState(() => {
    const savedMealPlan = localStorage.getItem('mealPlan');
    return savedMealPlan ? JSON.parse(savedMealPlan) : [];
  });

  // Initialize custom recipes (user-added recipes) from localStorage
  const [customRecipes, setCustomRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('customRecipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save mealPlan to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  // Save custom recipes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('customRecipes', JSON.stringify(customRecipes));
  }, [customRecipes]);

  // Toggle favorite: add if not in favorites, remove if already in favorites
  const toggleFavorite = (recipeId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(recipeId)) {
        return prevFavorites.filter((id) => id !== recipeId);
      } else {
        return [...prevFavorites, recipeId];
      }
    });
  };

  // Add recipe to meal plan (for now, just add if not already there)
  const addToMealPlan = (recipeId) => {
    setMealPlan((prevMealPlan) => {
      if (!prevMealPlan.includes(recipeId)) {
        return [...prevMealPlan, recipeId];
      }
      return prevMealPlan;
    });
  };

  // Check if recipe is in favorites
  const isFavorite = (recipeId) => {
    return favorites.includes(recipeId);
  };

  // Check if recipe is in meal plan
  const isInMealPlan = (recipeId) => {
    return mealPlan.includes(recipeId);
  };



  // delete recipe
  const deleteCustomRecipe = (id) => {
    setCustomRecipes(prev =>
      prev.filter(recipe => recipe.id !== id)
    );
  };



  // Add a new custom recipe
  const addCustomRecipe = (recipe) => {
    setCustomRecipes((prevRecipes) => {
      // Check if recipe with same ID already exists
      const exists = prevRecipes.some((r) => r.id === recipe.id);
      if (exists) {
        // Update existing recipe
        return prevRecipes.map((r) => (r.id === recipe.id ? recipe : r));
      }
      // Add new recipe
      return [...prevRecipes, recipe];
    });
  };

  return (
    <RecipeContext.Provider
      value={{
        favorites,
        mealPlan,
        customRecipes,
        deleteCustomRecipe,
        toggleFavorite,
        addToMealPlan,
        addCustomRecipe,
        isFavorite,
        isInMealPlan,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

