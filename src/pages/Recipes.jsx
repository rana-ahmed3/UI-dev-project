import React, { useState, useMemo } from 'react';




//filter, search, sort, first page, favourite, num of recipies, and toggle button

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

    const [favorites, setFavorites] = useState([]);        

    const toggleFavorite = (recipeId) => {
        setFavorites(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
    };

    const recipes = [
        // Italian
        {
            id: 1,
            name: "Spaghetti Carbonara",
            time: "30 min",
            difficulty: "Easy",
            image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
            cuisine: "Italian",
            mealType: "Dinner",
            dietary: []
        },
        {
            id: 2,
            name: "Margherita Pizza",
            time: "25 min",
            difficulty: "Medium",
            image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
            cuisine: "Italian",
            mealType: "Dinner",
            dietary: ["Vegetarian"]
        },
        {
            id: 3,
            name: "Tiramisu",
            time: "240 min",
            difficulty: "Medium",
            image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
            cuisine: "Italian",
            mealType: "Dessert",
            dietary: ["Vegetarian"]
        },

        // Mexican
        {
            id: 4,
            name: "Vegetarian Chili",
            time: "45 min",
            difficulty: "Medium",
            image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
            cuisine: "Mexican",
            mealType: "Dinner",
            dietary: ["Vegetarian", "Vegan"]
        },
        {
            id: 5,
            name: "Chicken Tacos",
            time: "20 min",
            difficulty: "Easy",
            image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
            cuisine: "Mexican",
            mealType: "Lunch",
            dietary: []
        },
        {
            id: 6,
            name: "Guacamole",
            time: "10 min",
            difficulty: "Easy",
            image: "https://tse2.mm.bing.net/th/id/OIP.UOvGjJSHgnMC9xGI5V1LeQHaLH?pid=Api&P=0&h=220",
            cuisine: "Mexican",
            mealType: "Lunch",
            dietary: ["Vegetarian", "Vegan", "Gluten-Free"]
        },

        // Japanese
        {
            id: 7,
            name: "Sushi Rolls",
            time: "40 min",
            difficulty: "Hard",
            image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
            cuisine: "Japanese",
            mealType: "Dinner",
            dietary: []
        },
        {
            id: 8,
            name: "Ramen",
            time: "60 min",
            difficulty: "Medium",
            image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
            cuisine: "Japanese",
            mealType: "Dinner",
            dietary: []
        },
        {
            id: 9,
            name: "Miso Soup",
            time: "15 min",
            difficulty: "Easy",
            image: "https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop",
            cuisine: "Japanese",
            mealType: "Lunch",
            dietary: ["Vegetarian", "Vegan", "Gluten-Free"]
        },

        // Indian
        {
            id: 10,
            name: "Butter Chicken",
            time: "50 min",
            difficulty: "Medium",
            image: "https://tse2.mm.bing.net/th/id/OIP.hcWbNbOAci5jAXs1OPrs1AHaLH?pid=Api&P=0&h=220",
            cuisine: "Indian",
            mealType: "Dinner",
            dietary: []
        },
        {
            id: 11,
            name: "Vegetable Curry",
            time: "35 min",
            difficulty: "Easy",
            image: "https://tse1.mm.bing.net/th/id/OIP.FpPegBKiiWT35VbixpAX1QHaKt?pid=Api&P=0&h=220",
            cuisine: "Indian",
            mealType: "Dinner",
            dietary: ["Vegetarian", "Vegan"]
        },
        {
            id: 12,
            name: "Chana Masala",
            time: "30 min",
            difficulty: "Medium",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
            cuisine: "Indian",
            mealType: "Lunch",
            dietary: ["Vegetarian", "Vegan", "Gluten-Free"]
        },

        // American
        {
            id: 13,
            name: "Classic Chicken Soup",
            time: "60 min",
            difficulty: "Easy",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
            cuisine: "American",
            mealType: "Lunch",
            dietary: []
        },
        {
            id: 14,
            name: "Avocado Toast",
            time: "10 min",
            difficulty: "Easy",
            image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop",
            cuisine: "American",
            mealType: "Breakfast",
            dietary: ["Vegetarian", "Vegan"]
        },
        {
            id: 15,
            name: "Fluffy Pancakes",
            time: "20 min",
            difficulty: "Easy",
            image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
            cuisine: "American",
            mealType: "Breakfast",
            dietary: ["Vegetarian"]
        },
        {
            id: 16,
            name: "Chocolate Cake",
            time: "90 min",
            difficulty: "Medium",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
            cuisine: "American",
            mealType: "Dessert",
            dietary: ["Vegetarian"]
        },

        // Mediterranean
        {
            id: 17,
            name: "Lemon Herb Salmon",
            time: "25 min",
            difficulty: "Medium",
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
            cuisine: "Mediterranean",
            mealType: "Dinner",
            dietary: []
        },
        {
            id: 18,
            name: "Quinoa Salad",
            time: "20 min",
            difficulty: "Easy",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
            cuisine: "Mediterranean",
            mealType: "Lunch",
            dietary: ["Vegetarian", "Vegan", "Gluten-Free"]
        },
        {
            id: 19,
            name: "Greek Salad",
            time: "15 min",
            difficulty: "Easy",
            image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
            cuisine: "Mediterranean",
            mealType: "Lunch",
            dietary: ["Vegetarian", "Gluten-Free"]
        },
        {
            id: 20,
            name: "Hummus",
            time: "10 min",
            difficulty: "Easy",
            image: "https://tse3.mm.bing.net/th/id/OIP.k_F_vG59BmBJ0Hx3G64uTgHaKc?pid=Api&P=0&h=220",
            cuisine: "Mediterranean",
            mealType: "Lunch",
            dietary: ["Vegetarian", "Vegan", "Gluten-Free"]
        }
    ];

    //convert time string to minutes
    const convertTimeToMinutes = (timeString) => {
        if (!timeString) return 0;

        const time = timeString.toLowerCase();

        // handle " hr and  min" format
        if (time.includes('hr') && time.includes('min')) {
            const parts = time.split(' ');
            const hours = parseInt(parts[0]) || 0;
            const minutes = parseInt(parts[2]) || 0;
            return hours * 60 + minutes;
        }

        // handle hours only to min
        if (time.includes('hr')) {
            const hours = parseInt(time) || 0;
            return hours * 60;
        }

        // handle min format
        if (time.includes('min')) {
            return parseInt(time) || 0;
        }

        return 0;
    };

    // filter and sort recipes
    const filteredAndSortedRecipes = useMemo(() => {
        let filtered = recipes.filter(recipe => {
            // show favorites filter
            if (showFavorites && !favorites.includes(recipe.id)) {
                return false;
            }

            // search 
            const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

            // cuisine
            const matchesCuisine = !filters.cuisine || recipe.cuisine === filters.cuisine;

            // meal type
            const matchesMealType = !filters.mealType || recipe.mealType === filters.mealType;

            // dietary
            const matchesDietary = filters.dietary.length === 0 ||
                filters.dietary.every(diet => recipe.dietary.includes(diet));

            return matchesSearch && matchesCuisine && matchesMealType && matchesDietary;
        });

        // sort recipes
        switch (sortBy) {
            case 'popular':
                //sort by popularity 
                filtered.sort((a, b) => {
                    const aFav = favorites.includes(a.id);
                    const bFav = favorites.includes(b.id);
                    if (aFav && !bFav) return -1;
                    if (!aFav && bFav) return 1;
                    return b.id - a.id;
                });
                break;
            case 'cookTime':
                // sort by cook time (shortest first)
                filtered.sort((a, b) => {
                    const timeA = convertTimeToMinutes(a.time);
                    const timeB = convertTimeToMinutes(b.time);
                    return timeA - timeB; // asc order (shortest first)
                });
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => b.id - a.id);
                break;
        }

        return filtered;
    }, [recipes, filters, searchTerm, sortBy, favorites, showFavorites]);

    // pagination
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

    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* sidebar Filters */}
            <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
                <div className="sticky top-28 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900">Filters</h3>

                    {/* favorites filter */}
                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                setShowFavorites(!showFavorites);
                                setCurrentPage(1);
                            }}
                            className={`w-full px-4 py-2 text-sm rounded-lg flex items-center gap-2 ${showFavorites
                                ? 'bg-red-100 text-red-700 font-medium'
                                : 'bg-slate-200 hover:bg-red-100 text-slate-700 hover:text-red-700'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                favorite
                            </span>
                            Show Favorites ({favorites.length})
                        </button>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-600">Cuisine</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Italian', 'Mexican', 'Japanese', 'Indian', 'American', 'Mediterranean'].map(cuisine => (
                                <button
                                    key={cuisine}
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, cuisine }));
                                        setCurrentPage(1);
                                    }}
                                    className={`px-3 py-1 text-sm rounded-full ${filters.cuisine === cuisine
                                        ? 'bg-green-100 text-green-700 font-medium'
                                        : 'bg-slate-200 hover:bg-green-100 text-slate-700 hover:text-green-700'
                                        }`}
                                >
                                    {cuisine}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-600">Meal Type</h4>
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
                        <h4 className="text-sm font-semibold text-slate-600">Dietary</h4>
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
                                        ? 'bg-green-100 text-green-700 font-medium'
                                        : 'bg-slate-200 hover:bg-green-100 text-slate-700 hover:text-green-700'
                                        }`}
                                >
                                    {diet}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={clearFilters}
                        className="w-full text-center text-sm font-medium text-slate-600 hover:text-green-600"
                    >
                        Clear Filters
                    </button>
                </div>
            </aside>

            {/* main Content */}
            <div className="flex-1 min-w-0">
                <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900">
                            {showFavorites ? 'Favorite Recipes' : 'Discover Recipes'}
                        </h1>
                        <p className="text-slate-600">
                            {showFavorites
                                ? 'Your saved favorite recipes'
                                : 'Explore our kitchen and find your next favorite meal.'
                            }
                        </p>
                    </div>

                    <div className="sticky top-[73px] z-10 bg-green-50 py-4 -my-4">
                        <div className="flex w-full items-stretch rounded-xl h-14 shadow-sm bg-white">
                            <div className="text-green-600 flex items-center justify-center pl-4 rounded-l-xl">
                                <span className="material-symbols-outlined text-2xl">search</span>
                            </div>
                            <input
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 border-none bg-transparent h-full placeholder:text-slate-400 px-4 rounded-l-none pl-2 text-base font-normal leading-normal"
                                placeholder="Search for recipes, ingredients, or keywords..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-sm text-slate-500">
                            Showing {currentRecipes.length} of {filteredAndSortedRecipes.length} recipes
                        </p>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="newest">Sort by: Newest</option>
                                <option value="popular">Sort by: Popular</option>
                                <option value="cookTime">Sort by: Cook Time</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-lg pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentRecipes.map(recipe => (
                            <div key={recipe.id} className="flex flex-col gap-3 group">
                                <div className="relative overflow-hidden rounded-xl">
                                    <div
                                        className="w-full bg-center bg-cover aspect-[4/3] rounded-xl transition-transform duration-300 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${recipe.image})` }}
                                    ></div>
                                    <button
                                        onClick={() => toggleFavorite(recipe.id)}
                                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-colors"
                                    >
                                        <span
                                            className={`material-symbols-outlined text-xl ${favorites.includes(recipe.id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                                                }`}
                                            style={favorites.includes(recipe.id) ? { fontVariationSettings: "'FILL' 1" } : {}}
                                        >
                                            favorite
                                        </span>
                                    </button>
                                </div>
                                <div>
                                    <p className="text-slate-900 text-base font-bold leading-normal">{recipe.name}</p>
                                    <p className="text-slate-500 text-sm font-normal leading-normal">{recipe.time} • {recipe.difficulty}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {currentRecipes.length === 0 && (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                                restaurant
                            </span>
                            <p className="text-slate-500 text-lg">No recipes found</p>
                            <p className="text-slate-400">Try changing your filters or search term</p>
                        </div>
                    )}

                    {/* pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center pt-8">
                            <nav className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center justify-center h-9 w-9 rounded-lg bg-white border border-slate-300 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                        : 'bg-white text-slate-500 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                                        return <span key={page} className="text-slate-500">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center justify-center h-9 w-9 rounded-lg bg-white border border-slate-300 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
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