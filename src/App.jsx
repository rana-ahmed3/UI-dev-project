import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { RecipeProvider } from './context/RecipeContext';
import { WeeklyMealProvider } from './context/WeeklyMealContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/common/Layout';
import Home from './pages/Home';
import RecipeDetails from './pages/RecipeDetails';
import AddRecipe from './pages/AddRecipe';
import Recipes from './pages/Recipes';
import Profile from './pages/Profile';
import Dashboard from './pages/MealPlanner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './pages/NotFound';

// Wrapper components for pages that need Layout
const HomeWithLayout = () => <Layout><Home /></Layout>;
const RecipeDetailsWithLayout = () => <Layout><RecipeDetails /></Layout>;
const RecipesWithLayout = () => <Layout><Recipes /></Layout>;
const AddRecipeWithLayout = () => <Layout><AddRecipe /></Layout>;
const DashboardWithLayout = () => <Layout><Dashboard /></Layout>;
const ProfileWithLayout = () => <Layout><Profile /></Layout>;
const LoginWithLayout = () => <Layout><Login /></Layout>;
const SignupWithLayout = () => <Layout><Signup /></Layout>;
const NotFoundWithLayout = () => <Layout><NotFound /></Layout>;

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RecipeProvider>
                    <WeeklyMealProvider>
                        <Router>
                            <Routes>
                                {/* Public routes */}
                                <Route path="/" element={<HomeWithLayout />} />
                                <Route path="/recipe/:id" element={<RecipeDetailsWithLayout />} />
                                <Route path="/login" element={<LoginWithLayout />} />
                                <Route path="/signup" element={<SignupWithLayout />} />

                                {/* Protected routes for authenticated users */}
                                <Route path="/recipes" element={
                                    <ProtectedRoute>
                                        <RecipesWithLayout />
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <ProfileWithLayout />
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/meal-planner" element={
                                    <ProtectedRoute>
                                        <DashboardWithLayout />
                                    </ProtectedRoute>
                                } />
                                
                                <Route path="/add-recipe" element={
                                    <ProtectedRoute>
                                        <AddRecipeWithLayout />
                                    </ProtectedRoute>
                                } />

                                {/* Admin-only routes */}
                                <Route path="/admin" element={
                                    <ProtectedRoute adminOnly={true}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                
                                {/* 404 page route */}
                                <Route path="*" element={<NotFoundWithLayout />} />
                            </Routes>
                        </Router>
                    </WeeklyMealProvider>
                </RecipeProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;