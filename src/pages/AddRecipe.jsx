import React, { useState } from 'react';
import Toast from '../components/common/Toast';
import Loading from '../components/common/Loading';
import { useRecipe } from '../context/RecipeContext';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
const AddRecipe = () => {
    const { addCustomRecipe } = useRecipe();
     const { isAdmin } = useAuth(); 
    const navigate = useNavigate();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [recipe, setRecipe] = useState({
        name: '',
        description: '',
        cuisineType: 'Italian',
        mealType: 'Breakfast',
        dietaryRestrictions: [],
        ingredients: [{ quantity: '', unit: '', name: '' }],
        instructions: [''],
        nutrition: {
            calories: '',
            protein: '',
            carbs: '',
            fat: ''
        }
    });




    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });


    // show toast
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    // handleSaveRecipe
    const handleSaveRecipe = async (e) => {
        e.preventDefault();

        // validation
        if (!recipe.name.trim()) {
            showToast('Please enter a recipe name', 'error');
            return;
        }

        if (recipe.ingredients.some(ing => !ing.name.trim())) {
            showToast('Please fill in all ingredient names', 'error');
            return;
        }

        if (recipe.instructions.some(instruction => !instruction.trim())) {
            showToast('Please fill in all instructions', 'error');
            return;
        }

        setIsSaving(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create recipe object with proper format
            const recipeId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const recipeToSave = {
                id: recipeId,
                name: recipe.name,
                title: recipe.name, // For compatibility
                description: recipe.description,
                shortDescription: recipe.description,
                cardDescription: recipe.description,
                cuisine: recipe.cuisineType,
                cuisineType: recipe.cuisineType,
                mealType: recipe.mealType,
                dietary: recipe.dietaryRestrictions,
                dietaryRestrictions: recipe.dietaryRestrictions,
                time: recipe.nutrition.calories ? `${recipe.nutrition.calories} min` : 'N/A',
                difficulty: 'Medium', // Default difficulty
                image: imagePreview || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
                ingredients: recipe.ingredients
                    .filter(ing => ing.name.trim())
                    .map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`.trim()),
                instructions: recipe.instructions.filter(inst => inst.trim()),
                nutrition: recipe.nutrition,
            };

            // Save to Context (which saves to localStorage)
            addCustomRecipe(recipeToSave);
            console.log('Recipe saved:', recipeToSave);

            // reset form
            setRecipe({
                name: '',
                description: '',
                cuisineType: 'Italian',
                mealType: 'Breakfast',
                dietaryRestrictions: [],
                ingredients: [{ quantity: '', unit: '', name: '' }],
                instructions: [''],
                nutrition: {
                    calories: '',
                    protein: '',
                    carbs: '',
                    fat: ''
                }
            });

            setSelectedImage(null);
            setImagePreview(null);
            showToast('Recipe saved successfully!', 'success'); 
            
            // Wait 2 seconds then redirect based on user role
            setTimeout(() => {
                if (isAdmin()) {
                    navigate('/admin'); // Admin goes to admin dashboard
                }
            }, 2000);
        } catch (error) {
            showToast('Error saving recipe. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    
        
    // handle cancel
    const handleCancel = () => {
        setShowCancelConfirm(true);
    };


    // confirm cancel
    const confirmCancel = () => {
        // reset form
        setRecipe({
            name: '',
            description: '',
            cuisineType: 'Italian',
            mealType: 'Breakfast',
            dietaryRestrictions: [],
            ingredients: [{ quantity: '', unit: '', name: '' }],
            instructions: [''],
            nutrition: {
                calories: '',
                protein: '',
                carbs: '',
                fat: ''
            }
        });

        setSelectedImage(null);
        setImagePreview(null);
        setShowCancelConfirm(false);
        showToast('Changes cancelled', 'success');
    };


    // confirm cancel
    const cancelCancel = () => {
        setShowCancelConfirm(false);
    };


    // handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // check if file is an image
            if (!file.type.startsWith('image/')) {
                showToast('Please select an image file', 'error');
                return;
            }

            // check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('Image size should be less than 5MB', 'error');
                return;
            }

            setSelectedImage(file);

            // create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // handle browse files
    const handleBrowseFiles = () => {
        // reset the input first
        const fileInput = document.getElementById('image-upload');
        fileInput.value = ''; 
        fileInput.click();
    };


    // handle drag over
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload({ target: { files } });
        }
    };



    // handle input change
    const handleInputChange = (field, value, section = null) => {
        if (section === 'nutrition') {
            setRecipe(prev => ({
                ...prev,
                nutrition: { ...prev.nutrition, [field]: value }
            }));
        } else {
            setRecipe(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };


    // add ingredient
    const addIngredient = () => {
        setRecipe(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { quantity: '', unit: '', name: '' }]
        }));
    };

    // remove ingredient
    const removeIngredient = (index) => {
        setRecipe(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };


    // update ingredient
    const updateIngredient = (index, field, value) => {
        setRecipe(prev => ({
            ...prev,
            ingredients: prev.ingredients.map((ing, i) =>
                i === index ? { ...ing, [field]: value } : ing
            )
        }));
    };

    // add instruction
    const addInstruction = () => {
        setRecipe(prev => ({
            ...prev,
            instructions: [...prev.instructions, '']
        }));
    };

    // remove instruction
    const removeInstruction = (index) => {
        setRecipe(prev => ({
            ...prev,
            instructions: prev.instructions.filter((_, i) => i !== index)
        }));
    };

    // update instruction
    const updateInstruction = (index, value) => {
        setRecipe(prev => ({
            ...prev,
            instructions: prev.instructions.map((inst, i) =>
                i === index ? value : inst
            )
        }));
    };


    // toggle dietary restriction
    const toggleDietaryRestriction = (restriction) => {
        setRecipe(prev => ({
            ...prev,
            dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
                ? prev.dietaryRestrictions.filter(r => r !== restriction)
                : [...prev.dietaryRestrictions, restriction]
        }));
    };

    // handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        handleSaveRecipe(e);
      
    };

    return (
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: 'success' })}
                />
            )}

            {/* confirm cancel modal */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Cancel Changes?</h3>
                        <p className="text-slate-600 dark:text-gray-400 mb-4">Are you sure you want to cancel? All changes will be lost.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelCancel}
                                className="px-4 py-2 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                Keep Editing
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
                            >
                                Cancel Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <div className="space-y-8">
                <div className="flex flex-col gap-3">
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
                        Add New Recipe
                    </h1>
                    <p className="text-slate-600 dark:text-gray-400 text-base font-normal leading-normal">
                        Fill in the details below to add your recipe to the collection.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* recipe basics */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-green-200 dark:border-green-800 pb-2">Recipe Basics</h3>

                        <div className="max-w-[480px]">
                            <label className="flex flex-col">
                                <p className="text-slate-700 dark:text-gray-300 text-base font-medium pb-2">Recipe Name</p>
                                <input
                                    value={recipe.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 h-14 placeholder:text-slate-400 dark:placeholder:text-gray-500 px-4 text-base font-normal"
                                    placeholder="e.g., Classic Lasagna"
                                />
                            </label>
                        </div>

                        <div className="max-w-[480px]">
                            <label className="flex flex-col">
                                <p className="text-slate-700 dark:text-gray-300 text-base font-medium pb-2">Recipe Description (Optional)</p>
                                <textarea
                                    value={recipe.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="w-full rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 min-h-36 placeholder:text-slate-400 dark:placeholder:text-gray-500 px-4 py-3 text-base font-normal"
                                    placeholder="A short and sweet description of your delicious recipe."
                                />
                            </label>
                        </div>

                        <div className="flex flex-col">
                            <div
                                className="flex flex-col items-center gap-6 rounded-lg border-2 border-dashed border-green-300 dark:border-green-700 px-6 py-14 bg-white dark:bg-gray-800 cursor-pointer"
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}

                            >
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    key={selectedImage ? 'has-image' : 'no-image'}
                                />

                                {imagePreview ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                setSelectedImage(null);
                                                setImagePreview(null);
                                                showToast('Image removed', 'success');
                                            }}
                                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                            Remove Image
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex max-w-[480px] flex-col items-center gap-2">
                                        <p className="text-slate-900 dark:text-white text-lg font-bold leading-tight text-center">Upload Recipe Image</p>
                                        <p className="text-slate-500 dark:text-gray-400 text-sm font-normal leading-normal text-center">Drag and drop an image here, or click to browse files.</p>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleBrowseFiles}
                                    className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-green-100 text-green-700 text-sm font-bold hover:bg-green-200"
                                >
                                    <span className="truncate">{imagePreview ? 'Change Image' : 'Browse Files'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* details section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 border-b border-green-200 pb-2">Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[480px]">
                            <label className="flex flex-col">
                                <p className="text-slate-700 dark:text-gray-300 text-base font-medium pb-2">Cuisine Type</p>
                                <select
                                    value={recipe.cuisineType}
                                    onChange={(e) => handleInputChange('cuisineType', e.target.value)}
                                    className="w-full rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 h-14 px-4 text-base"
                                >
                                    <option>Italian</option>
                                    <option>Mexican</option>
                                    <option>Indian</option>
                                    <option>Chinese</option>
                                </select>
                            </label>

                            <label className="flex flex-col">
                                <p className="text-slate-700 dark:text-gray-300 text-base font-medium pb-2">Meal Type</p>
                                <select
                                    value={recipe.mealType}
                                    onChange={(e) => handleInputChange('mealType', e.target.value)}
                                    className="w-full rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 h-14 px-4 text-base"
                                >
                                    <option>Breakfast</option>
                                    <option>Lunch</option>
                                    <option>Dinner</option>
                                    <option>Dessert</option>
                                </select>
                            </label>
                        </div>

                        <div className="space-y-2">
                            <p className="text-slate-700 dark:text-gray-300 text-base font-medium">Dietary Restrictions</p>
                            <div className="flex flex-wrap gap-3">
                                {['Vegan', 'Gluten-Free', 'Nut-Free', 'Vegetarian'].map(restriction => (
                                    <button
                                        key={restriction}
                                        type="button"
                                        onClick={() => toggleDietaryRestriction(restriction)}
                                        className={`flex items-center gap-2 rounded-full border border-green-300 dark:border-green-700 px-3 py-1.5 text-sm text-slate-700 dark:text-gray-300 ${recipe.dietaryRestrictions.includes(restriction) ? 'bg-green-100 dark:bg-green-900/30' : 'hover:bg-green-100 dark:hover:bg-green-900/30'
                                            }`}
                                    >
                                        {restriction}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ingredients section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 border-b border-green-200 pb-2">Ingredients</h3>

                        <div className="space-y-4">
                            {recipe.ingredients.map((ingredient, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr_auto] gap-4 items-end">
                                    <label className="flex flex-col">
                                        <p className="text-slate-700 dark:text-gray-300 text-sm font-medium pb-1">Quantity</p>
                                        <input
                                            value={ingredient.quantity}
                                            onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                                            className="rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 px-3 py-2"
                                            placeholder="e.g., 2"
                                            type="text"
                                        />
                                    </label>
                                    <label className="flex flex-col">
                                        <p className="text-slate-700 text-sm font-medium pb-1">Unit</p>
                                        <input
                                            value={ingredient.unit}
                                            onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                                            className="rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 px-3 py-2"
                                            placeholder="e.g., cups"
                                            type="text"
                                        />
                                    </label>
                                    <label className="flex flex-col">
                                        <p className="text-slate-700 text-sm font-medium pb-1">Name</p>
                                        <input
                                            value={ingredient.name}
                                            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                            className="rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 px-3 py-2"
                                            placeholder="e.g., All-purpose flour"
                                            type="text"
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                                    >
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addIngredient}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 bg-green-100 text-green-700 text-sm font-bold hover:bg-green-200"
                        >
                            <span className="material-symbols-outlined text-xl">add</span>
                            <span className="truncate">Add Ingredient</span>
                        </button>
                    </div>

                    {/* instructions section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 border-b border-green-200 pb-2">Instructions</h3>

                        <div className="space-y-4">
                            {recipe.instructions.map((instruction, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <span className="text-lg font-bold text-slate-500 dark:text-gray-400 pt-2">{index + 1}.</span>
                                    <textarea
                                        value={instruction}
                                        onChange={(e) => updateInstruction(index, e.target.value)}
                                        className="flex-1 min-h-24 rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 px-3 py-2"
                                        placeholder={`Describe step ${index + 1}...`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeInstruction(index)}
                                        className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 mt-2"
                                    >
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addInstruction}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 bg-green-100 text-green-700 text-sm font-bold hover:bg-green-200"
                        >
                            <span className="material-symbols-outlined text-xl">add</span>
                            <span className="truncate">Add Step</span>
                        </button>
                    </div>

                    {/* nutrition section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 border-b border-green-200 pb-2">Nutrition Information (Optional)</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="flex flex-col">
                                <p className="text-slate-700 dark:text-gray-300 text-sm font-medium pb-1">Calories</p>
                                <input
                                    value={recipe.nutrition.calories}
                                    onChange={(e) => handleInputChange('calories', e.target.value, 'nutrition')}
                                    className="rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 px-3 py-2"
                                    placeholder="e.g., 350"
                                    type="text"
                                />
                            </label>
                            <label className="flex flex-col">
                                <p className="text-slate-700 text-sm font-medium pb-1">Protein (g)</p>
                                <input
                                    value={recipe.nutrition.protein}
                                    onChange={(e) => handleInputChange('protein', e.target.value, 'nutrition')}
                                    className="rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 px-3 py-2"
                                    placeholder="e.g., 20"
                                    type="text"
                                />
                            </label>
                            <label className="flex flex-col">
                                <p className="text-slate-700 text-sm font-medium pb-1">Carbs (g)</p>
                                <input
                                    value={recipe.nutrition.carbs}
                                    onChange={(e) => handleInputChange('carbs', e.target.value, 'nutrition')}
                                    className="rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 px-3 py-2"
                                    placeholder="e.g., 45"
                                    type="text"
                                />
                            </label>
                            <label className="flex flex-col">
                                <p className="text-slate-700 text-sm font-medium pb-1">Fat (g)</p>
                                <input
                                    value={recipe.nutrition.fat}
                                    onChange={(e) => handleInputChange('fat', e.target.value, 'nutrition')}
                                    className="rounded-lg border border-green-300 dark:border-green-700 bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 px-3 py-2"
                                    placeholder="e.g., 15"
                                    type="text"
                                />
                            </label>
                        </div>
                    </div>

                    {/* action bar */}
                    <div className="flex justify-end items-center gap-4 pt-6 border-t border-green-200 dark:border-green-800 mt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-transparent text-slate-700 dark:text-gray-300 text-base font-bold hover:bg-slate-100 dark:hover:bg-gray-700"
                        >
                            <span className="truncate">Cancel</span>
                        </button>
                        <button
                            type="submit"
                            onClick={handleSaveRecipe}
                            disabled={isSaving}
                            className={`flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 text-base font-bold ${
                                isSaving 
                                    ? 'bg-green-400 text-white cursor-not-allowed' 
                                    : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                    <span className="truncate">Saving...</span>
                                </span>
                            ) : (
                                <span className="truncate">Save Recipe</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default AddRecipe;