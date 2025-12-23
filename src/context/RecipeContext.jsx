import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const RecipeContext = createContext();

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const { user, getUserData, updateUserData, isAuthenticated } = useAuth();
  
  // User-specific state
  const [favorites, setFavorites] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [customRecipes, setCustomRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data when user changes
  const loadUserData = useCallback(() => {
    if (user && isAuthenticated) {
      setIsLoading(true);
      const userData = getUserData();
      setFavorites(userData.favorites || []);
      setMealPlan(userData.mealPlan || []);
      setCustomRecipes(userData.customRecipes || []);
      setIsLoading(false);
    } else {
      // Clear data when logged out
      setFavorites([]);
      setMealPlan([]);
      setCustomRecipes([]);
      setIsLoading(false);
    }
  }, [user, isAuthenticated, getUserData]);

  // Load data on mount and when user changes
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Save data when it changes
  const saveUserData = useCallback(() => {
    if (user && isAuthenticated && !isLoading) {
      updateUserData({
        favorites,
        mealPlan,
        customRecipes
      });
    }
  }, [user, isAuthenticated, favorites, mealPlan, customRecipes, updateUserData, isLoading]);

  // Save data whenever favorites, mealPlan, or customRecipes change
  useEffect(() => {
    if (!isLoading) {
      saveUserData();
    }
  }, [favorites, mealPlan, customRecipes, isLoading, saveUserData]);

  // Force reload user data - useful after login
  const reloadUserData = () => {
    loadUserData();
  };

  // Toggle favorite: add if not in favorites, remove if already in favorites
  const toggleFavorite = (recipeId) => {
    if (!user || !isAuthenticated) {
      throw new Error('You must be logged in to add favorites');
    }
    
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(recipeId)) {
        return prevFavorites.filter((id) => id !== recipeId);
      } else {
        return [...prevFavorites, recipeId];
      }
    });
  };

  // Add recipe to meal plan
  const addToMealPlan = (recipeId) => {
    if (!user || !isAuthenticated) {
      throw new Error('You must be logged in to add to meal plan');
    }
    
    setMealPlan((prevMealPlan) => {
      if (!prevMealPlan.includes(recipeId)) {
        return [...prevMealPlan, recipeId];
      }
      return prevMealPlan;
    });
  };

  // Remove from meal plan
  const removeFromMealPlan = (recipeId) => {
    if (!user || !isAuthenticated) {
      throw new Error('You must be logged in to modify meal plan');
    }
    
    setMealPlan((prevMealPlan) => 
      prevMealPlan.filter((id) => id !== recipeId)
    );
  };

  // Check if recipe is in favorites
  const isFavorite = (recipeId) => {
    return favorites.includes(recipeId);
  };

  // Check if recipe is in meal plan
  const isInMealPlan = (recipeId) => {
    return mealPlan.includes(recipeId);
  };

  // Add a new custom recipe
  const addCustomRecipe = (recipe) => {
    if (!user || !isAuthenticated) {
      throw new Error('You must be logged in to add custom recipes');
    }
    
    setCustomRecipes((prevRecipes) => {
      const exists = prevRecipes.some((r) => r.id === recipe.id);
      if (exists) {
        return prevRecipes.map((r) => (r.id === recipe.id ? recipe : r));
      }
      return [...prevRecipes, recipe];
    });
  };

  // Delete custom recipe
  const deleteCustomRecipe = (id) => {
    if (!user || !isAuthenticated) {
      throw new Error('You must be logged in to delete recipes');
    }
    
    setCustomRecipes(prev =>
      prev.filter(recipe => recipe.id !== id)
    );
  };

  // Get all recipes (user's custom recipes + predefined recipes)
  const getAllRecipes = () => {
    // Base recipes that everyone can see
    const baseRecipes = [
      {
        id: 1,
        title: "Classic Italian Pasta",
        description: "Authentic Italian pasta with homemade tomato sauce",
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        prepTime: "15 min",
        cookTime: "20 min",
        servings: 4,
        difficulty: "Easy",
        category: "Italian",
        calories: 450,
        ingredients: ["Pasta", "Tomatoes", "Garlic", "Basil", "Olive Oil"],
        instructions: ["Boil pasta", "Make sauce", "Combine and serve"]
      },
      {
        id: 2,
        title: "Grilled Chicken Salad",
        description: "Healthy grilled chicken salad with fresh vegetables",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        prepTime: "20 min",
        cookTime: "15 min",
        servings: 2,
        difficulty: "Easy",
        category: "Healthy",
        calories: 320,
        ingredients: ["Chicken Breast", "Lettuce", "Tomatoes", "Cucumber", "Olive Oil"],
        instructions: ["Grill chicken", "Chop vegetables", "Mix with dressing"]
      },
      {
        id: 3,
        title: "Chocolate Chip Cookies",
        description: "Classic homemade chocolate chip cookies",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        prepTime: "15 min",
        cookTime: "12 min",
        servings: 24,
        difficulty: "Medium",
        category: "Dessert",
        calories: 150,
        ingredients: ["Flour", "Butter", "Sugar", "Chocolate Chips", "Vanilla"],
        instructions: ["Mix ingredients", "Form cookies", "Bake until golden"]
      },
      {
        id: 4,
        title: "Vegetable Stir Fry",
        description: "Quick and healthy vegetable stir fry with soy sauce",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        prepTime: "10 min",
        cookTime: "15 min",
        servings: 3,
        difficulty: "Easy",
        category: "Asian",
        calories: 280,
        ingredients: ["Bell Peppers", "Broccoli", "Carrots", "Soy Sauce", "Ginger"],
        instructions: ["Chop vegetables", "Stir fry in wok", "Add sauce"]
      },
      {
        id: 5,
        title: "Beef Burger",
        description: "Juicy beef burger with all the fixings",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        prepTime: "15 min",
        cookTime: "10 min",
        servings: 4,
        difficulty: "Medium",
        category: "American",
        calories: 550,
        ingredients: ["Beef Patty", "Burger Buns", "Lettuce", "Tomato", "Cheese"],
        instructions: ["Cook patty", "Toast buns", "Assemble burger"]
      },
      {
        id: 6,
        title: "Greek Salad",
        description: "Fresh Greek salad with feta cheese and olives",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        prepTime: "15 min",
        cookTime: "0 min",
        servings: 4,
        difficulty: "Easy",
        category: "Mediterranean",
        calories: 250,
        ingredients: ["Cucumber", "Tomatoes", "Feta Cheese", "Olives", "Olive Oil"],
        instructions: ["Chop vegetables", "Add cheese and olives", "Dress and serve"]
      }
    ];

    // Add user's custom recipes
    return [...customRecipes, ...baseRecipes];
  };

  // Get user's favorite recipes
  const getFavoriteRecipes = () => {
    const allRecipes = getAllRecipes();
    return allRecipes.filter(recipe => favorites.includes(recipe.id));
  };

  // Get user's meal plan recipes
  const getMealPlanRecipes = () => {
    const allRecipes = getAllRecipes();
    return allRecipes.filter(recipe => mealPlan.includes(recipe.id));
  };

  // Get recipe by ID
  const getRecipeById = (id) => {
    const allRecipes = getAllRecipes();
    return allRecipes.find(recipe => recipe.id === id);
  };

  // Clear all user data (for testing/debugging)
  const clearUserData = () => {
    if (user && isAuthenticated) {
      setFavorites([]);
      setMealPlan([]);
      setCustomRecipes([]);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        favorites,
        mealPlan,
        customRecipes,
        isLoading,
        toggleFavorite,
        addToMealPlan,
        removeFromMealPlan,
        addCustomRecipe,
        deleteCustomRecipe,
        isFavorite,
        isInMealPlan,
        getAllRecipes,
        getFavoriteRecipes,
        getMealPlanRecipes,
        getRecipeById,
        reloadUserData,
        clearUserData
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};