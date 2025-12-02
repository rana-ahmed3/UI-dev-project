import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  // =data
  const [weeklyMeals, setWeeklyMeals] = useState({
    saturday: {
      breakfast: 'French Toast',
      lunch: 'Burger & Fries',
      dinner: 'Steak Dinner'
    },
    sunday: {
      breakfast: 'Eggs & Bacon',
      lunch: 'Roast Chicken',
      dinner: 'Pasta Bake'
    },
    monday: {
      breakfast: 'Oatmeal Bowl',
      lunch: 'Caesar Salad',
      dinner: 'Pasta'
    },
    tuesday: {
      breakfast: 'Berry Smoothie',
      lunch: 'Turkey Sandwich',
      dinner: 'Grilled Chicken'
    },
    wednesday: {
      breakfast: 'Yogurt Parfait',
      lunch: 'Quinoa Bowl',
      dinner: 'Salmon'
    },
    thursday: {
      breakfast: 'Avocado Toast',
      lunch: 'Chicken Wrap',
      dinner: 'Vegetable Stir Fry'
    },
    friday: {
      breakfast: 'Pancakes',
      lunch: 'Soup & Salad',
      dinner: 'Pizza Night'
    }
  });

  //  meal statistics 
  const [mealStats, setMealStats] = useState({
    breakfast: { percentage: 0, count: 0 },
    lunch: { percentage: 0, count: 0 },
    dinner: { percentage: 0, count: 0 }
  });

  // model pop ip
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    day: '',
    dayLabel: '',
    mealType: '',
    currentMeal: '',
    action: 'edit'
  });
  const [newMealText, setNewMealText] = useState('');

  const [totalMeals, setTotalMeals] = useState(0);

  //  calculate meal statistics
  useEffect(() => {
    calculateMealStats();
  }, []);

  // initialize
  const calculateMealStats = () => {
    let breakfastCount = 0;
    let lunchCount = 0;
    let dinnerCount = 0;

    // Count meals for each type
    Object.values(weeklyMeals).forEach(day => {
      if (day.breakfast && day.breakfast.trim() !== '') breakfastCount++;
      if (day.lunch && day.lunch.trim() !== '') lunchCount++;
      if (day.dinner && day.dinner.trim() !== '') dinnerCount++;
    });

    const total = breakfastCount + lunchCount + dinnerCount;

    setMealStats({
      breakfast: {
        percentage: total > 0 ? Math.round((breakfastCount / total) * 100) : 0,
        count: breakfastCount
      },
      lunch: {
        percentage: total > 0 ? Math.round((lunchCount / total) * 100) : 0,
        count: lunchCount
      },
      dinner: {
        percentage: total > 0 ? Math.round((dinnerCount / total) * 100) : 0,
        count: dinnerCount
      }
    });

    setTotalMeals(total);
  };

  //  update meal
  const updateMeal = (day, mealType, newMeal) => {
    setWeeklyMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: newMeal
      }
    }));
    setModalOpen(false);
  };

  //  delete meal 
  const deleteMeal = (day, mealType) => {
    setWeeklyMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealType]: '' 
      }
    }));
    setModalOpen(false);
  };

  // open edit modal
  const openEditModal = (day, dayLabel, mealType, currentMeal) => {
    setModalData({
      day,
      dayLabel,
      mealType,
      currentMeal,
      action: 'edit'
    });
    setNewMealText(currentMeal);
    setModalOpen(true);
  };

  // open delete modal
  const openDeleteModal = (day, dayLabel, mealType, currentMeal) => {
    setModalData({
      day,
      dayLabel,
      mealType,
      currentMeal,
      action: 'delete'
    });
    setModalOpen(true);
  };

  // handle modal form submission
  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (modalData.action === 'edit' && newMealText.trim() !== '') {
      updateMeal(modalData.day, modalData.mealType, newMealText.trim());
    } else if (modalData.action === 'delete') {
      deleteMeal(modalData.day, modalData.mealType);
    }
  };

  // close modal
  const closeModal = () => {
    setModalOpen(false);
    setNewMealText('');
  };

  // Recalculate stats when weekly meals change
  useEffect(() => {
    calculateMealStats();
  }, [weeklyMeals]);

  //  data of days
  const days = [
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meal Planner Dashboard</h1>
        <p className="text-gray-600 mt-2">Your weekly meal planning overview</p>
      </div>

      {/* weekly meal plan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            <i className="fa-solid fa-calendar-week text-green-600 mr-2"></i>
            Weekly Meal Plan Summary
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Click on any meal to edit. Click the X icon to delete.
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {days.map(day => {
              const dayData = weeklyMeals[day.key];
              const hasBreakfast = dayData.breakfast && dayData.breakfast.trim() !== '';
              const hasLunch = dayData.lunch && dayData.lunch.trim() !== '';
              const hasDinner = dayData.dinner && dayData.dinner.trim() !== '';

              return (
                <div key={day.key} className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-3">{day.label}</h3>
                  <div className="space-y-2">
                    {/* Breakfast */}
                    <div 
                      className="bg-green-50 rounded-lg p-3 text-left cursor-pointer hover:opacity-90 transition-opacity border border-green-200 relative group"
                      onClick={() => {
                        if (hasBreakfast) {
                          openEditModal(day.key, day.label, 'breakfast', dayData.breakfast);
                        } else {
                          openEditModal(day.key, day.label, 'breakfast', '');
                        }
                      }}
                    >
                      <p className="text-xs font-medium text-green-800 mb-1 capitalize flex justify-between items-center">
                        <span>breakfast</span>
                        {hasBreakfast && (
                          <button 
                            className="delete-btn text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal(day.key, day.label, 'breakfast', dayData.breakfast);
                            }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        )}
                      </p>
                      <p className={`text-sm text-green-700 ${!hasBreakfast ? 'italic text-gray-400' : ''}`}>
                        {hasBreakfast ? dayData.breakfast : '+ Add breakfast'}
                      </p>
                    </div>
                    
                    {/* Lunch */}
                    <div 
                      className="bg-blue-50 rounded-lg p-3 text-left cursor-pointer hover:opacity-90 transition-opacity border border-blue-200 relative group"
                      onClick={() => {
                        if (hasLunch) {
                          openEditModal(day.key, day.label, 'lunch', dayData.lunch);
                        } else {
                          openEditModal(day.key, day.label, 'lunch', '');
                        }
                      }}
                    >
                      <p className="text-xs font-medium text-blue-800 mb-1 capitalize flex justify-between items-center">
                        <span>lunch</span>
                        {hasLunch && (
                          <button 
                            className="delete-btn text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal(day.key, day.label, 'lunch', dayData.lunch);
                            }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        )}
                      </p>
                      <p className={`text-sm text-blue-700 ${!hasLunch ? 'italic text-gray-400' : ''}`}>
                        {hasLunch ? dayData.lunch : '+ Add lunch'}
                      </p>
                    </div>
                    
                    {/* Dinner */}
                    <div 
                      className="bg-purple-50 rounded-lg p-3 text-left cursor-pointer hover:opacity-90 transition-opacity border border-purple-200 relative group"
                      onClick={() => {
                        if (hasDinner) {
                          openEditModal(day.key, day.label, 'dinner', dayData.dinner);
                        } else {
                          openEditModal(day.key, day.label, 'dinner', '');
                        }
                      }}
                    >
                      <p className="text-xs font-medium text-purple-800 mb-1 capitalize flex justify-between items-center">
                        <span>dinner</span>
                        {hasDinner && (
                          <button 
                            className="delete-btn text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteModal(day.key, day.label, 'dinner', dayData.dinner);
                            }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        )}
                      </p>
                      <p className={`text-sm text-purple-700 ${!hasDinner ? 'italic text-gray-400' : ''}`}>
                        {hasDinner ? dayData.dinner : '+ Add dinner'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* edit/delete modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* modal title */}
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-lg font-bold text-gray-900">
                  {modalData.action === 'edit' 
                    ? `${modalData.currentMeal ? 'Edit' : 'Add'} ${modalData.mealType} for ${modalData.dayLabel}`
                    : `Delete ${modalData.mealType} from ${modalData.dayLabel}`
                  }
                </h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* modal content */}
              <form onSubmit={handleModalSubmit} className="mt-4">
                {modalData.action === 'edit' ? (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meal Name
                      </label>
                      <input
                        type="text"
                        value={newMealText}
                        onChange={(e) => setNewMealText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder={`Enter ${modalData.mealType} name`}
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={!newMealText.trim()}
                      >
                        {modalData.currentMeal ? 'Update Meal' : 'Add Meal'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center mb-2">
                        <i className="fa-solid fa-triangle-exclamation text-red-500 mr-2"></i>
                        <p className="font-medium text-red-800">Confirm Deletion</p>
                      </div>
                      <p className="text-sm text-red-600">
                        Are you sure you want to delete "<span className="font-semibold">{modalData.currentMeal}</span>" from {modalData.dayLabel} {modalData.mealType}?
                      </p>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete Meal
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* charts  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* meal type distribution  */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            <i className="fa-solid fa-chart-pie text-green-600 mr-2"></i>
            Meal Type Distribution
          </h2>
          
          <div className="space-y-4">
            {/* Breakfast */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-700">Breakfast</span>
                </div>
                <span className="text-gray-500">
                  {mealStats.breakfast.percentage}% ({mealStats.breakfast.count} meals)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${mealStats.breakfast.percentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Lunch */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-700">Lunch</span>
                </div>
                <span className="text-gray-500">
                  {mealStats.lunch.percentage}% ({mealStats.lunch.count} meals)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${mealStats.lunch.percentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Dinner */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-700">Dinner</span>
                </div>
                <span className="text-gray-500">
                  {mealStats.dinner.percentage}% ({mealStats.dinner.count} meals)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${mealStats.dinner.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-gray-50">
            <div className="flex items-center">
              <i className="fa-solid fa-circle-info text-gray-800 mr-3"></i>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Total:</span> {totalMeals} meals planned this week
              </p>
            </div>
          </div>
        </div>

        {/* favorite recipes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            <i className="fa-solid fa-heart text-red-500 mr-2"></i>
            Favorite Recipes by Category
          </h2>
          <div className="space-y-4">
            {/* Main Courses */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center">
                  <i className="fa-solid fa-utensils text-blue-500 mr-2"></i>
                  <span className="font-medium text-gray-700">Main Courses</span>
                </div>
                <span className="text-gray-500">12 recipes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>
            
            {/* Desserts  */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center">
                  <i className="fa-solid fa-ice-cream text-purple-500 mr-2"></i>
                  <span className="font-medium text-gray-700">Desserts</span>
                </div>
                <span className="text-gray-500">8 recipes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full"
                  style={{ width: '40%' }}
                ></div>
              </div>
            </div>
            
            {/* Salads */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center">
                  <i className="fa-solid fa-leaf text-green-500 mr-2"></i>
                  <span className="font-medium text-gray-700">Salads</span>
                </div>
                <span className="text-gray-500">5 recipes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: '25%' }}
                ></div>
              </div>
            </div>
            
            {/* Snacks */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center">
                  <i className="fa-solid fa-cookie text-orange-500 mr-2"></i>
                  <span className="font-medium text-gray-700">Snacks</span>
                </div>
                <span className="text-gray-500">3 recipes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-orange-600 h-3 rounded-full"
                  style={{ width: '15%' }}
                ></div>
              </div>
            </div>
            
            {/* Soups  */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center">
                  <i className="fa-solid fa-bowl-food text-red-500 mr-2"></i>
                  <span className="font-medium text-gray-700">Soups</span>
                </div>
                <span className="text-gray-500">2 recipes</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-600 h-3 rounded-full"
                  style={{ width: '10%' }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <i className="fa-solid fa-circle-info text-gray-800 mr-1"></i>
              <span className="font-semibold">Total:</span> 30 favorite recipes across 5 categories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;