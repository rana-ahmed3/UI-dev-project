import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import AddRecipe from './pages/AddRecipe';
import Recipes from './pages/Recipes';
import Profile from './pages/Profile';
import Dashboard from './pages/MealPlanner';
import Login from './pages/Login';
import Signup from './pages/Signup';


//routing
const Home = () => <div className="p-8 text-center">Home Page - Under Construction</div>;

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/add-recipe" element={<AddRecipe />} />
                    <Route path="/meal-planner" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                     <Route path="/signup" element={<Signup />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;