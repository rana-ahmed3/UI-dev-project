import React, { useState, useEffect } from 'react';
import { useRecipe } from '../context/RecipeContext';
import { useWeeklyMeal } from '../context/WeeklyMealContext';

const Dashboard = () => {
  const { favorites, customRecipes } = useRecipe();
  const { weeklyMeals, updateMeal, deleteMeal, resetMeals, clearAllMeals } = useWeeklyMeal();

  // Meal statistics
  const [mealStats, setMealStats] = useState({
    breakfast: { percentage: 0, count: 0 },
    lunch: { percentage: 0, count: 0 },
    dinner: { percentage: 0, count: 0 }
  });

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    day: '', dayLabel: '', mealType: '', currentMeal: '', action: 'edit'
  });
  const [newMealText, setNewMealText] = useState('');
  const [totalMeals, setTotalMeals] = useState(0);

  // Favorite recipes stats
  const [favoriteCategoryStats, setFavoriteCategoryStats] = useState({
    'Main Courses': 0,
    'Desserts': 0,
    'Salads': 0,
    'Snacks': 0,
    'Soups': 0,
    'Other': 0
  });
  const [totalFavorites, setTotalFavorites] = useState(0);

  // INTERACTIVE CHART 1: Meal Difficulty Level - HEAT MAP
  const [heatMapData, setHeatMapData] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealDetails, setMealDetails] = useState(null);

  // INTERACTIVE CHART 2: Meal Cost Trends - Line Chart Only
  const [costData, setCostData] = useState([]);
  const [costFilter, setCostFilter] = useState('week');
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayDetails, setDayDetails] = useState(null);

  // Chart 3: Today's Meal Prep Time (Wednesday) - Bar Chart
  const [todaysPrepTimeData, setTodaysPrepTimeData] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState(null);

  // Chart 4: Cuisine Distribution - Pie Chart
  const [cuisineData, setCuisineData] = useState([]);

  // Days data
  const days = [
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' }
  ];

  // Cuisine options for filter
  const cuisineOptions = ['All', 'Italian', 'Mexican', 'American', 'Asian', 'Mediterranean', 'Indian'];

  // Meal difficulty data - Heat Map concept
  const mealDifficultyData = {
    'All': [
      { meal: 'Pasta', cuisine: 'Italian', difficulty: 2, prepTime: 20, ingredients: 8, skillLevel: 'Beginner' },
      { meal: 'Pizza', cuisine: 'Italian', difficulty: 3, prepTime: 45, ingredients: 10, skillLevel: 'Intermediate' },
      { meal: 'Burger', cuisine: 'American', difficulty: 2, prepTime: 25, ingredients: 7, skillLevel: 'Beginner' },
      { meal: 'Salad', cuisine: 'American', difficulty: 1, prepTime: 10, ingredients: 6, skillLevel: 'Beginner' },
      { meal: 'Tacos', cuisine: 'Mexican', difficulty: 2, prepTime: 30, ingredients: 9, skillLevel: 'Beginner' },
      { meal: 'Stir Fry', cuisine: 'Asian', difficulty: 3, prepTime: 35, ingredients: 12, skillLevel: 'Intermediate' },
      { meal: 'Curry', cuisine: 'Indian', difficulty: 4, prepTime: 60, ingredients: 15, skillLevel: 'Advanced' },
      { meal: 'Soup', cuisine: 'American', difficulty: 2, prepTime: 40, ingredients: 10, skillLevel: 'Beginner' },
      { meal: 'Steak', cuisine: 'American', difficulty: 3, prepTime: 25, ingredients: 6, skillLevel: 'Intermediate' },
      { meal: 'Salmon', cuisine: 'Mediterranean', difficulty: 2, prepTime: 20, ingredients: 7, skillLevel: 'Beginner' },
      { meal: 'Roast Chicken', cuisine: 'American', difficulty: 4, prepTime: 90, ingredients: 8, skillLevel: 'Advanced' },
      { meal: 'Sushi', cuisine: 'Asian', difficulty: 5, prepTime: 60, ingredients: 15, skillLevel: 'Expert' }
    ],
    'Italian': [
      { meal: 'Pasta', cuisine: 'Italian', difficulty: 2, prepTime: 20, ingredients: 8, skillLevel: 'Beginner' },
      { meal: 'Pizza', cuisine: 'Italian', difficulty: 3, prepTime: 45, ingredients: 10, skillLevel: 'Intermediate' },
      { meal: 'Risotto', cuisine: 'Italian', difficulty: 4, prepTime: 40, ingredients: 12, skillLevel: 'Intermediate' },
      { meal: 'Lasagna', cuisine: 'Italian', difficulty: 4, prepTime: 75, ingredients: 15, skillLevel: 'Advanced' },
      { meal: 'Tiramisu', cuisine: 'Italian', difficulty: 3, prepTime: 30, ingredients: 9, skillLevel: 'Intermediate' }
    ],
    'Mexican': [
      { meal: 'Tacos', cuisine: 'Mexican', difficulty: 2, prepTime: 30, ingredients: 9, skillLevel: 'Beginner' },
      { meal: 'Burritos', cuisine: 'Mexican', difficulty: 2, prepTime: 25, ingredients: 8, skillLevel: 'Beginner' },
      { meal: 'Enchiladas', cuisine: 'Mexican', difficulty: 3, prepTime: 50, ingredients: 12, skillLevel: 'Intermediate' },
      { meal: 'Guacamole', cuisine: 'Mexican', difficulty: 1, prepTime: 10, ingredients: 5, skillLevel: 'Beginner' },
      { meal: 'Chili', cuisine: 'Mexican', difficulty: 3, prepTime: 60, ingredients: 14, skillLevel: 'Intermediate' }
    ],
    'American': [
      { meal: 'Burger', cuisine: 'American', difficulty: 2, prepTime: 25, ingredients: 7, skillLevel: 'Beginner' },
      { meal: 'Salad', cuisine: 'American', difficulty: 1, prepTime: 10, ingredients: 6, skillLevel: 'Beginner' },
      { meal: 'Steak', cuisine: 'American', difficulty: 3, prepTime: 25, ingredients: 6, skillLevel: 'Intermediate' },
      { meal: 'Soup', cuisine: 'American', difficulty: 2, prepTime: 40, ingredients: 10, skillLevel: 'Beginner' },
      { meal: 'Roast Chicken', cuisine: 'American', difficulty: 4, prepTime: 90, ingredients: 8, skillLevel: 'Advanced' }
    ],
    'Asian': [
      { meal: 'Stir Fry', cuisine: 'Asian', difficulty: 3, prepTime: 35, ingredients: 12, skillLevel: 'Intermediate' },
      { meal: 'Sushi', cuisine: 'Asian', difficulty: 5, prepTime: 60, ingredients: 15, skillLevel: 'Expert' },
      { meal: 'Ramen', cuisine: 'Asian', difficulty: 4, prepTime: 90, ingredients: 18, skillLevel: 'Advanced' },
      { meal: 'Spring Rolls', cuisine: 'Asian', difficulty: 3, prepTime: 40, ingredients: 11, skillLevel: 'Intermediate' },
      { meal: 'Fried Rice', cuisine: 'Asian', difficulty: 2, prepTime: 25, ingredients: 9, skillLevel: 'Beginner' }
    ],
    'Mediterranean': [
      { meal: 'Salmon', cuisine: 'Mediterranean', difficulty: 2, prepTime: 20, ingredients: 7, skillLevel: 'Beginner' },
      { meal: 'Hummus', cuisine: 'Mediterranean', difficulty: 1, prepTime: 15, ingredients: 6, skillLevel: 'Beginner' },
      { meal: 'Greek Salad', cuisine: 'Mediterranean', difficulty: 1, prepTime: 15, ingredients: 8, skillLevel: 'Beginner' },
      { meal: 'Shawarma', cuisine: 'Mediterranean', difficulty: 4, prepTime: 120, ingredients: 16, skillLevel: 'Advanced' },
      { meal: 'Falafel', cuisine: 'Mediterranean', difficulty: 3, prepTime: 45, ingredients: 12, skillLevel: 'Intermediate' }
    ],
    'Indian': [
      { meal: 'Curry', cuisine: 'Indian', difficulty: 4, prepTime: 60, ingredients: 15, skillLevel: 'Advanced' },
      { meal: 'Biryani', cuisine: 'Indian', difficulty: 5, prepTime: 90, ingredients: 20, skillLevel: 'Expert' },
      { meal: 'Tandoori Chicken', cuisine: 'Indian', difficulty: 3, prepTime: 50, ingredients: 12, skillLevel: 'Intermediate' },
      { meal: 'Samosa', cuisine: 'Indian', difficulty: 4, prepTime: 60, ingredients: 14, skillLevel: 'Advanced' },
      { meal: 'Naan', cuisine: 'Indian', difficulty: 3, prepTime: 40, ingredients: 7, skillLevel: 'Intermediate' }
    ]
  };

  // Calculate meal statistics
  const calculateMealStats = () => {
    let breakfastCount = 0, lunchCount = 0, dinnerCount = 0;

    Object.values(weeklyMeals).forEach(day => {
      if (day.breakfast?.trim()) breakfastCount++;
      if (day.lunch?.trim()) lunchCount++;
      if (day.dinner?.trim()) dinnerCount++;
    });

    const total = breakfastCount + lunchCount + dinnerCount;

    setMealStats({
      breakfast: { percentage: total > 0 ? Math.round((breakfastCount / total) * 100) : 0, count: breakfastCount },
      lunch: { percentage: total > 0 ? Math.round((lunchCount / total) * 100) : 0, count: lunchCount },
      dinner: { percentage: total > 0 ? Math.round((dinnerCount / total) * 100) : 0, count: dinnerCount }
    });

    setTotalMeals(total);
  };

  // Calculate favorite recipes statistics
  const calculateFavoriteStats = () => {
    const hardcodedRecipes = [
      { id: 1, name: "Spaghetti Carbonara", cuisine: "Italian", mealType: "Dinner" },
      { id: 2, name: "Margherita Pizza", cuisine: "Italian", mealType: "Dinner" },
      { id: 3, name: "Tiramisu", cuisine: "Italian", mealType: "Dessert" },
      { id: 4, name: "Vegetarian Chili", cuisine: "Mexican", mealType: "Dinner" },
      { id: 5, name: "Chicken Tacos", cuisine: "Mexican", mealType: "Lunch" },
      { id: 6, name: "Guacamole", cuisine: "Mexican", mealType: "Lunch" },
      { id: 7, name: "Sushi Rolls", cuisine: "Japanese", mealType: "Dinner" },
      { id: 8, name: "Ramen", cuisine: "Japanese", mealType: "Dinner" },
      { id: 9, name: "Miso Soup", cuisine: "Japanese", mealType: "Lunch" },
      { id: 10, name: "Butter Chicken", cuisine: "Indian", mealType: "Dinner" },
      { id: 11, name: "Vegetable Curry", cuisine: "Indian", mealType: "Dinner" },
      { id: 12, name: "Chana Masala", cuisine: "Indian", mealType: "Lunch" },
      { id: 13, name: "Classic Chicken Soup", cuisine: "American", mealType: "Lunch" },
      { id: 14, name: "Avocado Toast", cuisine: "American", mealType: "Breakfast" },
      { id: 15, name: "Fluffy Pancakes", cuisine: "American", mealType: "Breakfast" },
      { id: 16, name: "Chocolate Cake", cuisine: "American", mealType: "Dessert" },
      { id: 17, name: "Lemon Herb Salmon", cuisine: "Mediterranean", mealType: "Dinner" },
      { id: 18, name: "Quinoa Salad", cuisine: "Mediterranean", mealType: "Lunch" },
      { id: 19, name: "Greek Salad", cuisine: "Mediterranean", mealType: "Lunch" },
      { id: 20, name: "Hummus", cuisine: "Mediterranean", mealType: "Lunch" }
    ];

    const mealTypeToCategory = {
      'Breakfast': 'Main Courses',
      'Lunch': 'Main Courses',
      'Dinner': 'Main Courses',
      'Dessert': 'Desserts'
    };

    const categoryCounts = {
      'Main Courses': 0,
      'Desserts': 0,
      'Salads': 0,
      'Snacks': 0,
      'Soups': 0,
      'Other': 0
    };

    favorites.forEach(favId => {
      const recipe = hardcodedRecipes.find(r => r.id === favId);
      if (recipe) {
        let category = mealTypeToCategory[recipe.mealType] || 'Other';
        if (recipe.name.toLowerCase().includes('salad')) category = 'Salads';
        else if (recipe.name.toLowerCase().includes('soup')) category = 'Soups';
        else if (recipe.name.toLowerCase().includes('snack') ||
          recipe.name.toLowerCase().includes('guacamole') ||
          recipe.name.toLowerCase().includes('hummus')) category = 'Snacks';
        categoryCounts[category]++;
      }
    });

    setFavoriteCategoryStats(categoryCounts);
    setTotalFavorites(favorites.length);
  };

  // Generate heat map data
  const generateHeatMapData = () => {
    const data = mealDifficultyData[selectedCuisine] || mealDifficultyData['All'];
    setHeatMapData(data);
    setSelectedMeal(null);
    setMealDetails(null);
  };

  // Generate meal cost trends data - LINE CHART ONLY
  const generateCostData = () => {
    let data = [];

    if (costFilter === 'week') {
      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      data = daysOfWeek.map((day, index) => ({
        day,
        cost: Math.floor(Math.random() * 30) + 10,
        meals: Math.floor(Math.random() * 3) + 1,
        details: {
          breakfast: Math.floor(Math.random() * 8) + 3,
          lunch: Math.floor(Math.random() * 12) + 5,
          dinner: Math.floor(Math.random() * 15) + 8,
          snacks: Math.floor(Math.random() * 5) + 2
        }
      }));
    } else if (costFilter === 'month') {
      data = Array.from({ length: 4 }, (_, i) => ({
        week: `Week ${i + 1}`,
        cost: Math.floor(Math.random() * 100) + 50,
        meals: Math.floor(Math.random() * 10) + 5,
        details: {
          groceries: Math.floor(Math.random() * 60) + 30,
          diningOut: Math.floor(Math.random() * 40) + 10,
          mealKits: Math.floor(Math.random() * 20) + 5
        }
      }));
    }

    setCostData(data);
    setSelectedDay(null);
    setDayDetails(null);
  };

  // Generate today's (Wednesday) meal prep time data
  const generateTodaysPrepTimeData = () => {
    const wednesdayMeals = weeklyMeals.wednesday;

    const mealsData = [];

    // Meal prep time mapping
    const mealPrepTimeMapping = {
      'Breakfast Items': {
        'French Toast': 20, 'Eggs & Bacon': 15, 'Oatmeal Bowl': 10, 'Berry Smoothie': 5,
        'Yogurt Parfait': 5, 'Avocado Toast': 10, 'Pancakes': 25, 'Oatmeal': 10,
        'Smoothie': 5, 'Toast': 5, 'Cereal': 2, 'Yogurt': 2, 'Eggs': 10, 'Bacon': 15
      },
      'Lunch Items': {
        'Burger & Fries': 30, 'Roast Chicken': 90, 'Caesar Salad': 15, 'Turkey Sandwich': 10,
        'Quinoa Bowl': 25, 'Chicken Wrap': 15, 'Soup & Salad': 20, 'Salad': 15,
        'Sandwich': 10, 'Wrap': 15, 'Bowl': 20, 'Soup': 25, 'Pasta': 20, 'Pizza': 15
      },
      'Dinner Items': {
        'Steak Dinner': 30, 'Pasta Bake': 45, 'Pasta': 20, 'Grilled Chicken': 25,
        'Salmon': 20, 'Vegetable Stir Fry': 25, 'Pizza Night': 20, 'Steak': 25,
        'Chicken': 25, 'Fish': 20, 'Stir Fry': 25, 'Bake': 45, 'Roast': 90, 'Grill': 30
      }
    };

    // Get breakfast prep time
    if (wednesdayMeals.breakfast?.trim()) {
      const breakfastName = wednesdayMeals.breakfast;
      let prepTime = 10;

      for (const [category, meals] of Object.entries(mealPrepTimeMapping)) {
        for (const [mealName, time] of Object.entries(meals)) {
          if (breakfastName.toLowerCase().includes(mealName.toLowerCase()) ||
            mealName.toLowerCase().includes(breakfastName.toLowerCase())) {
            prepTime = time;
            break;
          }
        }
      }

      mealsData.push({
        meal: breakfastName,
        type: 'Breakfast',
        time: prepTime,
        category: 'Breakfast Items',
        color: 'bg-green-500'
      });
    }

    // Get lunch prep time
    if (wednesdayMeals.lunch?.trim()) {
      const lunchName = wednesdayMeals.lunch;
      let prepTime = 20;

      for (const [category, meals] of Object.entries(mealPrepTimeMapping)) {
        for (const [mealName, time] of Object.entries(meals)) {
          if (lunchName.toLowerCase().includes(mealName.toLowerCase()) ||
            mealName.toLowerCase().includes(lunchName.toLowerCase())) {
            prepTime = time;
            break;
          }
        }
      }

      mealsData.push({
        meal: lunchName,
        type: 'Lunch',
        time: prepTime,
        category: 'Lunch Items',
        color: 'bg-blue-500'
      });
    }

    // Get dinner prep time
    if (wednesdayMeals.dinner?.trim()) {
      const dinnerName = wednesdayMeals.dinner;
      let prepTime = 30;

      for (const [category, meals] of Object.entries(mealPrepTimeMapping)) {
        for (const [mealName, time] of Object.entries(meals)) {
          if (dinnerName.toLowerCase().includes(mealName.toLowerCase()) ||
            mealName.toLowerCase().includes(dinnerName.toLowerCase())) {
            prepTime = time;
            break;
          }
        }
      }

      mealsData.push({
        meal: dinnerName,
        type: 'Dinner',
        time: prepTime,
        category: 'Dinner Items',
        color: 'bg-purple-500'
      });
    }

    setTodaysPrepTimeData(mealsData);
  };

  // Generate cuisine distribution data
  const generateCuisineData = () => {
    const cuisines = ['Italian', 'Mexican', 'Japanese', 'Indian', 'American', 'Mediterranean', 'Other'];
    const data = cuisines.map(cuisine => ({
      cuisine,
      count: Math.floor(Math.random() * 5) + 1,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    }));

    setCuisineData(data);
  };

  // Initialize all data
  useEffect(() => {
    calculateMealStats();
    calculateFavoriteStats();
    generateHeatMapData();
    generateCostData();
    generateTodaysPrepTimeData();
    generateCuisineData();
  }, [weeklyMeals]);

  // Update heat map data when cuisine changes
  useEffect(() => {
    generateHeatMapData();
  }, [selectedCuisine]);

  // Update cost data when filter changes
  useEffect(() => {
    generateCostData();
  }, [costFilter]);

  // Update stats when weekly meals change
  useEffect(() => {
    calculateMealStats();
    generateTodaysPrepTimeData();
    generateCuisineData();
  }, [weeklyMeals]);

  // Update favorite stats when favorites change
  useEffect(() => {
    calculateFavoriteStats();
  }, [favorites]);

  // Modal functions
  const openEditModal = (day, dayLabel, mealType, currentMeal) => {
    setModalData({ day, dayLabel, mealType, currentMeal, action: 'edit' });
    setNewMealText(currentMeal);
    setModalOpen(true);
  };

  const openDeleteModal = (day, dayLabel, mealType, currentMeal) => {
    setModalData({ day, dayLabel, mealType, currentMeal, action: 'delete' });
    setModalOpen(true);
  };

  const handleUpdateMeal = (day, mealType, newMeal) => {
    updateMeal(day, mealType, newMeal);
    setModalOpen(false);
  };

  const handleDeleteMeal = (day, mealType) => {
    deleteMeal(day, mealType);
    setModalOpen(false);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (modalData.action === 'edit' && newMealText.trim() !== '') {
      handleUpdateMeal(modalData.day, modalData.mealType, newMealText.trim());
    } else if (modalData.action === 'delete') {
      handleDeleteMeal(modalData.day, modalData.mealType);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewMealText('');
  };

  // Drill-down functions
  const handleHeatMapClick = (mealItem) => {
    setSelectedMeal(mealItem.meal);
    setMealDetails(mealItem);
  };

  const handleDayClick = (dataPoint) => {
    setSelectedDay(costFilter === 'week' ? dataPoint.day : dataPoint.week);
    setDayDetails(dataPoint.details);
  };

  const handleMealClick = (mealType) => {
    setSelectedMealType(mealType);
  };

  // Get color for difficulty level (heat map colors)
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 hover:bg-green-200 text-green-800';
      case 2: return 'bg-blue-100 hover:bg-blue-200 text-blue-800';
      case 3: return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';
      case 4: return 'bg-orange-100 hover:bg-orange-200 text-orange-800';
      case 5: return 'bg-red-100 hover:bg-red-200 text-red-800';
      default: return 'bg-gray-100 hover:bg-gray-200 text-gray-800';
    }
  };

  // Get skill level label
  const getSkillLevel = (difficulty) => {
    switch (difficulty) {
      case 1: return 'Very Easy';
      case 2: return 'Easy';
      case 3: return 'Medium';
      case 4: return 'Hard';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };

  // Render Heat Map
  const renderHeatMap = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {heatMapData.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${getDifficultyColor(item.difficulty)}`}
              onClick={() => handleHeatMapClick(item)}
            >
              <div className="text-center">
                <div className="font-semibold text-sm mb-1">{item.meal}</div>
                <div className="text-xs opacity-75 mb-2">{item.cuisine}</div>
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full ${level <= item.difficulty ?
                        (item.difficulty === 1 ? 'bg-green-500' :
                          item.difficulty === 2 ? 'bg-blue-500' :
                            item.difficulty === 3 ? 'bg-yellow-500' :
                              item.difficulty === 4 ? 'bg-orange-500' : 'bg-red-500') :
                        'bg-gray-300'}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Very Easy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Easy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Hard</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Expert</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Line Chart for Cost Trends
  const renderCostChart = () => {
    const maxCost = Math.max(...costData.map(d => d.cost));

    return (
      <div className="relative h-64">
        <svg width="100%" height="100%" className="overflow-visible">
          {costData.map((point, i) => {
            const x = (i / (costData.length - 1)) * 100;
            const y = 100 - (point.cost / maxCost) * 100;

            return (
              <g key={i}>
                {i > 0 && (
                  <line
                    x1={`${(i - 1) / (costData.length - 1) * 100}%`}
                    y1={`${100 - (costData[i - 1].cost / maxCost) * 100}%`}
                    x2={`${x}%`}
                    y2={`${y}%`}
                    stroke="#3B82F6"
                    strokeWidth="3"
                    className="transition-all duration-300 hover:stroke-width-4"
                  />
                )}
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="6"
                  fill="#3B82F6"
                  className="cursor-pointer hover:r-8 transition-all duration-300"
                  onClick={() => handleDayClick(point)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Render Today's Meal Prep Time Bar Chart
  const renderTodaysPrepTimeChart = () => {
    const maxTime = Math.max(...todaysPrepTimeData.map(d => d.time), 1);

    return (
      <div className="space-y-6">
        <div className="flex items-end h-48 gap-6 px-4">
          {todaysPrepTimeData.map((item, idx) => {
            const height = (item.time / maxTime) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="flex-1 w-full flex items-end">
                  <div
                    className={`w-full ${item.color} rounded-t-lg transition-all duration-300 hover:opacity-90 cursor-pointer`}
                    style={{ height: `${height}%` }}
                    onClick={() => handleMealClick(item.type)}
                  ></div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.type}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.time} min</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Meal Details */}
        <div className="space-y-3">
          {todaysPrepTimeData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">{item.meal}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.type}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900 dark:text-white">{item.time} min</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.time < 15 ? 'Quick' : item.time < 30 ? 'Moderate' : 'Lengthy'} prep
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Title with Reset Buttons */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meal Planner Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Advanced meal planning with interactive analytics</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              if (window.confirm('Reset all meals to default?')) {
                resetMeals();
              }
            }}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={() => {
              if (window.confirm('Clear all meals? This cannot be undone.')) {
                clearAllMeals();
              }
            }}
            className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Weekly Meal Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                <i className="fa-solid fa-calendar-week text-green-600 mr-2"></i>
                Weekly Meal Plan Summary
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Click on any meal to edit. Click the X icon to delete. Changes are saved automatically.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {days.map(day => {
              const dayData = weeklyMeals[day.key];
              const hasBreakfast = dayData.breakfast?.trim();
              const hasLunch = dayData.lunch?.trim();
              const hasDinner = dayData.dinner?.trim();

              return (
                <div key={day.key} className="text-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{day.label}</h3>
                  <div className="space-y-2">
                    {['breakfast', 'lunch', 'dinner'].map((mealType, idx) => {
                      const hasMeal = dayData[mealType]?.trim();
                      const colors = {
                        breakfast: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', darkText: 'text-green-400', label: 'text-green-800' },
                        lunch: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', darkText: 'text-blue-400', label: 'text-blue-800' },
                        dinner: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', darkText: 'text-purple-400', label: 'text-purple-800' }
                      };
                      const color = colors[mealType];

                      return (
                        <div
                          key={mealType}
                          className={`${color.bg} rounded-lg p-3 text-left cursor-pointer hover:opacity-90 transition-opacity border ${color.border} relative group`}
                          onClick={() => {
                            if (hasMeal) {
                              openEditModal(day.key, day.label, mealType, dayData[mealType]);
                            } else {
                              openEditModal(day.key, day.label, mealType, '');
                            }
                          }}
                        >
                          <p className={`text-xs font-medium ${color.label} dark:${color.darkText} mb-1 capitalize flex justify-between items-center`}>
                            <span>{mealType}</span>
                            {hasMeal && (
                              <button
                                className="delete-btn text-xs text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteModal(day.key, day.label, mealType, dayData[mealType]);
                                }}
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            )}
                          </p>
                          <p className={`text-sm ${color.text} dark:${color.darkText} ${!hasMeal ? 'italic text-gray-400 dark:text-gray-500' : ''}`}>
                            {hasMeal ? dayData[mealType] : `+ Add ${mealType}`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-300 dark:border-gray-600 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {modalData.action === 'edit'
                    ? `${modalData.currentMeal ? 'Edit' : 'Add'} ${modalData.mealType} for ${modalData.dayLabel}`
                    : `Delete ${modalData.mealType} from ${modalData.dayLabel}`
                  }
                </h3>
                <button onClick={closeModal} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleModalSubmit} className="mt-4">
                {modalData.action === 'edit' ? (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Name</label>
                      <input
                        type="text"
                        value={newMealText}
                        onChange={(e) => setNewMealText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder={`Enter ${modalData.mealType} name`}
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700" disabled={!newMealText.trim()}>
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
                      <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
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

      {/* 6 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart 1: Meal Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            <i className="fa-solid fa-chart-pie text-green-600 mr-2"></i>
            Meal Type Distribution
          </h2>
          <div className="space-y-4">
            {['breakfast', 'lunch', 'dinner'].map((type, idx) => {
              const stats = mealStats[type];
              const colors = ['green', 'blue', 'purple'];
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 bg-${colors[idx]}-500 rounded-full mr-2`}></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{type}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">{stats.percentage}% ({stats.count} meals)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div className={`bg-${colors[idx]}-500 h-4 rounded-full transition-all duration-500`} style={{ width: `${stats.percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center">
              <i className="fa-solid fa-circle-info text-gray-800 dark:text-gray-300 mr-3"></i>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Total:</span> {totalMeals} meals planned this week
              </p>
            </div>
          </div>
        </div>

        {/* Chart 2: Favorite Recipes by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              <i className="fa-solid fa-heart text-red-500 mr-2"></i>
              Favorite Recipes by Category
            </h2>
            <span className="text-sm bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-3 py-1 rounded-full">
              {totalFavorites} favorites
            </span>
          </div>
          <div className="space-y-4">
            {Object.entries(favoriteCategoryStats).map(([category, count], idx) => {
              const colors = ['blue', 'purple', 'green', 'orange', 'red', 'indigo'];
              const icons = ['fa-utensils', 'fa-ice-cream', 'fa-leaf', 'fa-cookie', 'fa-bowl-food', 'fa-ellipsis'];
              const percentage = totalFavorites > 0 ? (count / totalFavorites) * 100 : 0;

              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center">
                      <i className={`fa-solid ${icons[idx]} text-${colors[idx]}-500 mr-2`}></i>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{category}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">
                      {count} {count === 1 ? 'recipe' : 'recipes'} ({Math.round(percentage)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`bg-${colors[idx]}-600 h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* INTERACTIVE CHART 1: Meal Difficulty Level - HEAT MAP */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              <i className="fa-solid fa-chart-simple text-yellow-600 mr-2"></i>
              Meal Difficulty Level
            </h2>
            <div className="relative">
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {cuisineOptions.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none"></i>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Difficulty heat map for: <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedCuisine}</span> cuisine
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Click on any meal to see detailed difficulty information
            </p>
          </div>

          {/* Drill-down View */}
          {selectedMeal && mealDetails ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    setSelectedMeal(null);
                    setMealDetails(null);
                  }}
                  className="flex items-center text-sm text-yellow-600 hover:text-yellow-700"
                >
                  <i className="fa-solid fa-arrow-left mr-2"></i>
                  Back to heat map
                </button>
                <span className="text-sm font-semibold text-yellow-600">{selectedMeal} Details</span>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg ${getDifficultyColor(mealDetails.difficulty)}`}>
                    <span className="font-bold text-lg">{mealDetails.difficulty}/5</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">{mealDetails.meal}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{mealDetails.cuisine} Cuisine</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Skill Level</div>
                    <div className="font-bold text-gray-900 dark:text-white">{getSkillLevel(mealDetails.difficulty)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Prep Time</div>
                    <div className="font-bold text-gray-900 dark:text-white">{mealDetails.prepTime} min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Ingredients</div>
                    <div className="font-bold text-gray-900 dark:text-white">{mealDetails.ingredients}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Difficulty Breakdown</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Overall Difficulty</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mealDetails.difficulty}/5 ({getSkillLevel(mealDetails.difficulty)})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Preparation Complexity</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mealDetails.prepTime > 45 ? 'High' : mealDetails.prepTime > 25 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Ingredient Count</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {mealDetails.ingredients > 12 ? 'Many' : mealDetails.ingredients > 8 ? 'Moderate' : 'Few'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Main Heat Map */
            <div className="mb-6">
              {renderHeatMap()}
            </div>
          )}

          <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <div className="flex items-center">
              <i className="fa-solid fa-fire text-yellow-600 dark:text-yellow-400 mr-3"></i>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Heat Map:</span> Color intensity shows difficulty level. Green = Easy, Red = Expert.
              </p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE CHART 2: Meal Cost Trends - LINE CHART ONLY */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              <i className="fa-solid fa-chart-line text-blue-600 mr-2"></i>
              Meal Cost Trends
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setCostFilter('week')}
                className={`px-3 py-1 text-sm rounded-full ${costFilter === 'week' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                Week
              </button>
              <button
                onClick={() => setCostFilter('month')}
                className={`px-3 py-1 text-sm rounded-full ${costFilter === 'month' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                Month
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-center mb-2">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${costData.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total cost this {costFilter}</p>
            </div>
          </div>

          {/* Drill-down View */}
          {selectedDay && dayDetails ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => {
                    setSelectedDay(null);
                    setDayDetails(null);
                  }}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <i className="fa-solid fa-arrow-left mr-2"></i>
                  Back to chart
                </button>
                <span className="text-sm font-semibold text-blue-600">{selectedDay} Details</span>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Cost Breakdown</h4>
                <div className="space-y-3">
                  {Object.entries(dayDetails).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{category.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium text-gray-900 dark:text-white">${amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cost per Meal</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    ${(costData.find(d => (costFilter === 'week' ? d.day : d.week) === selectedDay)?.cost /
                      costData.find(d => (costFilter === 'week' ? d.day : d.week) === selectedDay)?.meals || 0).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Number of Meals</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {costData.find(d => (costFilter === 'week' ? d.day : d.week) === selectedDay)?.meals || 0}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Main Line Chart */
            <div className="mb-6">
              {renderCostChart()}
            </div>
          )}

          <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center">
              <i className="fa-solid fa-chart-line text-blue-600 dark:text-blue-400 mr-3"></i>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Line Chart:</span> Shows cost trends over time. Click data points for cost breakdown.
              </p>
            </div>
          </div>
        </div>


        {/* Chart 3: Today's (Wednesday) Meal Preparation Time - BAR CHART */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-clock text-purple-600"></i>
              Today's Meal Preparation Time
            </h2>
            <span className="text-sm px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              Wednesday
            </span>
          </div>

          {/* Check if there is data */}
          {todaysPrepTimeData.length > 0 ? (
            <div>
              {/* Bar Chart */}
              <div className="relative h-72 flex mt-10">
                {/* Y Axis */}
                <div className="flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-3">
                  {[100, 75, 50, 25, 0].map(v => (
                    <span key={v}>{v} min</span>
                  ))}
                </div>

                {/* Bars */}
                <div className="flex-1 flex items-end justify-around border-l border-b border-gray-200 dark:border-gray-600 pl-6 pb-4">
                  {todaysPrepTimeData.map((item, idx) => {
                    const heightPercent = (item.time / 100) * 100;
                    const colors = {
                      Breakfast: 'bg-green-500',
                      Lunch: 'bg-blue-500',
                      Dinner: 'bg-purple-500'
                    };

                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-3 w-24 cursor-pointer"
                        onClick={() => handleMealClick(item.type)}
                      >
                        {/* Bar */}
                        <div className="relative w-full h-56 flex items-end ">
                          <div
                            className={`
                      w-full rounded-t-lg transition-all duration-300
                      ${colors[item.type]}
                      ${selectedMealType === item.type ? 'ring-4 ring-purple-300' : ''}
                    `}
                            style={{ height: `${heightPercent}%` }}
                          />
                          {/* Value */}
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {item.time} min
                          </span>
                        </div>

                        {/* Labels */}
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.type}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[90px]">
                            {item.meal}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Time</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {todaysPrepTimeData.reduce((s, m) => s + m.time, 0)} min
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average / Meal</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {Math.round(
                      todaysPrepTimeData.reduce((s, m) => s + m.time, 0) /
                      todaysPrepTimeData.length
                    )} min
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <i className="fa-solid fa-utensils text-4xl mb-3"></i>
              <p>No meals planned for Wednesday</p>
            </div>
          )}
        </div>

        {/* Chart 4: Cuisine Distribution - PIE CHART */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            <i className="fa-solid fa-globe text-red-600 mr-2"></i>
            Cuisine Distribution
          </h2>

          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {cuisineData.reduce((sum, item) => sum + item.count, 0)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                </div>
              </div>
              <svg width="192" height="192" viewBox="0 0 192 192" className="transform -rotate-90">
                {(() => {
                  let cumulativePercent = 0;
                  return cuisineData.map((item, idx) => {
                    const percent = item.count / cuisineData.reduce((sum, i) => sum + i.count, 1) * 100;
                    const [x1, y1] = getCoordinatesForPercent(cumulativePercent / 100, 96, 70);
                    cumulativePercent += percent;
                    const [x2, y2] = getCoordinatesForPercent(cumulativePercent / 100, 96, 70);

                    const largeArcFlag = percent > 50 ? 1 : 0;
                    const pathData = [
                      `M ${x1} ${y1}`,
                      `A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      `L 96 96`
                    ].join(' ');

                    return (
                      <path
                        key={idx}
                        d={pathData}
                        fill={item.color}
                        className="transition-all duration-300 hover:opacity-90"
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  });
                })()}
              </svg>
            </div>

            <div className="w-full space-y-3">
              {cuisineData.map((item, idx) => {
                const percentage = (item.count / cuisineData.reduce((sum, i) => sum + i.count, 1)) * 100;
                return (
                  <div key={idx} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{item.cuisine}</span>
                        <span className="text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for pie chart coordinates
function getCoordinatesForPercent(percent, centerX, radius) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [centerX + x * radius, centerX + y * radius];
}

export default Dashboard;