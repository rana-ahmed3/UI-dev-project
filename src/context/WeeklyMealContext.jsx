import React, { createContext, useContext, useState, useEffect } from 'react';

const WeeklyMealContext = createContext();

export const useWeeklyMeal = () => {
  const context = useContext(WeeklyMealContext);
  if (!context) {
    throw new Error('useWeeklyMeal must be used within a WeeklyMealProvider');
  }
  return context;
};

export const WeeklyMealProvider = ({ children }) => {
  // Initialize weekly meals from localStorage
  const [weeklyMeals, setWeeklyMeals] = useState(() => {
    const savedWeeklyMeals = localStorage.getItem('weeklyMeals');
    if (savedWeeklyMeals) {
      return JSON.parse(savedWeeklyMeals);
    }
    // Default meals if nothing in localStorage
    return {
      saturday: { breakfast: 'French Toast', lunch: 'Burger & Fries', dinner: 'Steak Dinner' },
      sunday: { breakfast: 'Eggs & Bacon', lunch: 'Roast Chicken', dinner: 'Pasta Bake' },
      monday: { breakfast: 'Oatmeal Bowl', lunch: 'Caesar Salad', dinner: 'Pasta' },
      tuesday: { breakfast: 'Berry Smoothie', lunch: 'Turkey Sandwich', dinner: 'Grilled Chicken' },
      wednesday: { breakfast: 'Yogurt Parfait', lunch: 'Quinoa Bowl', dinner: 'Salmon' },
      thursday: { breakfast: 'Avocado Toast', lunch: 'Chicken Wrap', dinner: 'Vegetable Stir Fry' },
      friday: { breakfast: 'Pancakes', lunch: 'Soup & Salad', dinner: 'Pizza Night' }
    };
  });

  // Save weekly meals to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('weeklyMeals', JSON.stringify(weeklyMeals));
  }, [weeklyMeals]);

  // Function to update a specific meal
  const updateMeal = (day, mealType, newMeal) => {
    setWeeklyMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: newMeal
      }
    }));
  };

  // Function to delete a specific meal
  const deleteMeal = (day, mealType) => {
    setWeeklyMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: ''
      }
    }));
  };

  // Function to reset all meals to default
  const resetMeals = () => {
    setWeeklyMeals({
      saturday: { breakfast: 'French Toast', lunch: 'Burger & Fries', dinner: 'Steak Dinner' },
      sunday: { breakfast: 'Eggs & Bacon', lunch: 'Roast Chicken', dinner: 'Pasta Bake' },
      monday: { breakfast: 'Oatmeal Bowl', lunch: 'Caesar Salad', dinner: 'Pasta' },
      tuesday: { breakfast: 'Berry Smoothie', lunch: 'Turkey Sandwich', dinner: 'Grilled Chicken' },
      wednesday: { breakfast: 'Yogurt Parfait', lunch: 'Quinoa Bowl', dinner: 'Salmon' },
      thursday: { breakfast: 'Avocado Toast', lunch: 'Chicken Wrap', dinner: 'Vegetable Stir Fry' },
      friday: { breakfast: 'Pancakes', lunch: 'Soup & Salad', dinner: 'Pizza Night' }
    });
  };

  // Function to clear all meals
  const clearAllMeals = () => {
    setWeeklyMeals({
      saturday: { breakfast: '', lunch: '', dinner: '' },
      sunday: { breakfast: '', lunch: '', dinner: '' },
      monday: { breakfast: '', lunch: '', dinner: '' },
      tuesday: { breakfast: '', lunch: '', dinner: '' },
      wednesday: { breakfast: '', lunch: '', dinner: '' },
      thursday: { breakfast: '', lunch: '', dinner: '' },
      friday: { breakfast: '', lunch: '', dinner: '' }
    });
  };

  // Function to get a specific meal
  const getMeal = (day, mealType) => {
    return weeklyMeals[day]?.[mealType] || '';
  };

  // Function to get all meals for a specific day
  const getDayMeals = (day) => {
    return weeklyMeals[day] || { breakfast: '', lunch: '', dinner: '' };
  };

  return (
    <WeeklyMealContext.Provider
      value={{
        weeklyMeals,
        setWeeklyMeals,
        updateMeal,
        deleteMeal,
        resetMeals,
        clearAllMeals,
        getMeal,
        getDayMeals
      }}
    >
      {children}
    </WeeklyMealContext.Provider>
  );
};