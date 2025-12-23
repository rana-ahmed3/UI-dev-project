import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, BarChart, LogOut, Moon, Sun, PlusCircle, Search, Trash2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useRecipe } from '../context/RecipeContext';

const AdminDashboard = () => {
  const { user, logout, isAdmin, getAllRegisteredUsers, updateUserRole } = useAuth();
  const { customRecipes } = useRecipe();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Get total recipes count from localStorage
  const getTotalRecipesCount = () => {
    try {
      // Get all recipe-related data from localStorage
      let totalRecipes = customRecipes.length; // Start with custom recipes
      
      // Check if there are default/hardcoded recipes in localStorage
      const defaultRecipes = localStorage.getItem('defaultRecipes');
      if (defaultRecipes) {
        const parsedRecipes = JSON.parse(defaultRecipes);
        totalRecipes += parsedRecipes.length;
      }
      
      // Also check for any other recipe storage
      const allKeys = Object.keys(localStorage);
      const recipeKeys = allKeys.filter(key => key.includes('recipe') || key.includes('Recipes'));
      
      recipeKeys.forEach(key => {
        try {
          const recipes = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(recipes)) {
            totalRecipes += recipes.length;
          }
        } catch (error) {
          // Ignore parsing errors
        }
      });
      
      return totalRecipes;
    } catch (error) {
      console.error('Error counting recipes:', error);
      return customRecipes.length; 
      // Fallback to custom recipes only
    }
  };

  // Load real users from AuthContext
  useEffect(() => {
    if (user && isAdmin()) {
      const registeredUsers = getAllRegisteredUsers();
      setUsers(registeredUsers.map(user => ({
        ...user,
        status: 'active' // Default status
      })));
      setLoading(false);
    } else if (user && !isAdmin()) {
      navigate('/'); // Redirect non-admin users to home
    } else {
      navigate('/login'); // Redirect unauthenticated users to login
    }
  }, [user, isAdmin, navigate, getAllRegisteredUsers]);

  // Calculate statistics from real data
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalRecipes: getTotalRecipesCount(),
    pendingRecipes: 0,
    totalReviews: 0,
    avgRating: 4.7
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleRoleChange = (userId, newRole) => {
    const result = updateUserRole(userId, newRole);
    if (result.success) {
      const updatedUsers = getAllRegisteredUsers();
      setUsers(updatedUsers.map(user => ({
        ...user,
        status: user.status || 'active'
      })));
      showNotification(`User role updated to ${newRole}`, 'success');
    } else {
      showNotification(result.message, 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToAddRecipe = () => {
    navigate('/add-recipe');
  };

  // Delete user function
  const deleteUser = (userId) => {
    if (userId === user?.id) {
      showNotification('You cannot delete your own account!', 'error');
      return;
    }

    // Get all users
    const allUsers = getAllRegisteredUsers();
    
    // Filter out the user to delete
    const updatedUsers = allUsers.filter(u => u.id !== userId);
    
    // Save updated users list
    try {
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      // Also delete the user's data from localStorage
      const userDataKey = `user_${userId}_data`;
      localStorage.removeItem(userDataKey);
      
      // Update state
      setUsers(updatedUsers.map(user => ({
        ...user,
        status: user.status || 'active'
      })));
      
      setDeleteConfirm(null);
      showNotification('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Error deleting user. Please try again.', 'error');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete User</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Are you sure you want to delete this user?
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Warning:</strong> This action cannot be undone. All user data including favorites, meal plans, and custom recipes will be permanently deleted.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(deleteConfirm.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 transition"
              >
                <Trash2 className="h-4 w-4" />
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
          <span className={`text-sm font-medium ${
            notification.type === 'success' 
              ? 'text-green-800 dark:text-green-300' 
              : 'text-red-800 dark:text-red-300'
          }`}>
            {notification.message}
          </span>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Admin Navbar built into the page */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 dark:bg-red-500 text-white">
                <Shield className="h-5 w-5" />
              </div>
              <span className="font-semibold text-lg text-gray-900 dark:text-white">Admin Dashboard</span>
            </div>
            
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={goToAddRecipe}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <PlusCircle className="h-4 w-4" />
                Add Recipe
              </button>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Hi {user?.firstName || 'Administrator'}
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 dark:bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 dark:hover:bg-red-600 transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-inset ring-gray-300 dark:ring-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                aria-label="Toggle menu"
              >
                <span className="block h-4 w-4">
                  <span className={`block h-0.5 w-4 bg-gray-700 dark:bg-gray-300 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block h-0.5 w-4 bg-gray-700 dark:bg-gray-300 mt-1 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 w-4 bg-gray-700 dark:bg-gray-300 mt-1 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </span>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col gap-4">
                <button
                  onClick={goToAddRecipe}
                  className="px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Recipe
                </button>
                <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  Hi {user?.firstName || 'Administrator'}
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 dark:bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 dark:hover:bg-red-600 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Admin Dashboard Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome, {user?.firstName}! Manage users and system settings
              </p>
            </div>
            <button
              onClick={goToAddRecipe}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 dark:bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 dark:hover:bg-emerald-600 transition"
            >
              <PlusCircle className="h-4 w-4" />
              Add New Recipe
            </button>
          </div>
        </div>

        {/* Statistics - Only keep these 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalUsers}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stats.activeUsers} active</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Recipes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalRecipes+15}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {customRecipes.length} custom + 15 default
                  {/* {stats.totalRecipes - customRecipes.length}  */}
                </p>
              </div>
              <BarChart className="h-10 w-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">System Admin</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{user?.firstName || 'Admin'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
              </div>
              <Shield className="h-10 w-10 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Users Management
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Users ({filteredUsers.length})</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                View all registered users and manage their accounts
              </p>
            </div>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try a different search term' : 'No users registered yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((userItem) => (
                    <tr key={userItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={userItem.avatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'}
                            alt={userItem.firstName}
                            className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {userItem.firstName} {userItem.lastName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">ID: {userItem.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {userItem.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={userItem.role}
                          onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                          className={`bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-900 dark:text-white transition ${
                            userItem.id === user?.id ? 'cursor-not-allowed opacity-70' : ''
                          }`}
                          disabled={userItem.id === user?.id}
                        >
                          <option value="user">Regular User</option>
                          <option value="admin">Administrator</option>
                        </select>
                        {userItem.id === user?.id && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">(Current user)</p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {userItem.joinDate || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => setDeleteConfirm(userItem)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center gap-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={userItem.id === user?.id}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Info Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>
                Showing {filteredUsers.length} of {users.length} users
              </span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Last Operation Status - Keep only this notification section */}
        {notification && (
          <div className={`mt-8 p-4 rounded-lg flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              <span className={`text-sm font-medium ${
                notification.type === 'success' 
                  ? 'text-green-800 dark:text-green-400' 
                  : 'text-red-800 dark:text-red-400'
              }`}>
                {notification.message}
              </span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;