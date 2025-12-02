import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import AddRecipe from './pages/AddRecipe';
import Recipes from './pages/Recipes';
import Profile from './pages/Profile';
import Dashboard from './pages/MealPlanner';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
    return (
        <Router>
            <Routes>
                {/* Home and RecipeDetails don't use Layout (they have their own Navbar/Footer) */}
                <Route path="/" element={<Home />} />
                <Route path="/recipe/:id" element={<RecipeDetails />} />
                
                {/* Other pages use Layout */}
                <Route path="/recipes" element={<Layout><Recipes /></Layout>} />
                <Route path="/add-recipe" element={<Layout><AddRecipe /></Layout>} />
                <Route path="/meal-planner" element={<Layout><Dashboard /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/signup" element={<Layout><Signup /></Layout>} />
            </Routes>
        </Router>
    );
}

export default App;