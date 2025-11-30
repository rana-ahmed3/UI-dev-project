import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import AddRecipe from './pages/AddRecipe';
import Recipes from './pages/Recipes';

//routing
const Home = () => <div className="p-8 text-center">Home Page - Under Construction</div>;
const MealPlanner = () => <div className="p-8 text-center">Meal Planner Page - Under Construction</div>;
const Profile = () => <div className="p-8 text-center">Profile Page - Under Construction</div>;
const Login = () => <div className="p-8 text-center">Login Page - Under Construction</div>;

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/add-recipe" element={<AddRecipe />} />
                    <Route path="/meal-planner" element={<MealPlanner />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;