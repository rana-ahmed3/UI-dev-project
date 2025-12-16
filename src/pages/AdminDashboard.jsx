import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, BarChart, Settings, AlertCircle, CheckCircle, Lock, Unlock, LogOut, Home, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AdminDashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock data for admin dashboard
  const [users, setUsers] = useState([
    { id: 1, name: 'Rana Ahmed', email: 'rana.ahmed@zewailcity.edu.eg', role: 'user', joinDate: 'Jan 2024', status: 'active' },
    { id: 2, name: 'Admin User', email: 'admin@recipefinder.com', role: 'admin', joinDate: 'Dec 2023', status: 'active' },
    { id: 3, name: 'John Doe', email: 'john@gmailo.com', role: 'user', joinDate: 'Mar 2024', status: 'inactive' },
    { id: 4, name: 'Jane Smith', email: 'jane@gmail.com', role: 'user', joinDate: 'Feb 2024', status: 'active' },
  ]);

  const stats = {
    totalUsers: 152,
    activeUsers: 142,
    totalRecipes: 324,
    pendingRecipes: 12,
    totalReviews: 845,
    avgRating: 4.7
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleUserStatus = (userId, newStatus) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goToMainSite = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                onClick={goToMainSite}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Home className="h-4 w-4" />
                Main Site
              </button>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                className="inline-flex items-center gap-2 rounded-md bg-red-600 dark:bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 dark:hover:bg-red-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-inset ring-gray-300 dark:ring-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                  onClick={goToMainSite}
                  className="px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Main Site
                </button>
                <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  Hi {user?.firstName || 'Administrator'}
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 dark:bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 dark:hover:bg-red-600"
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
        
          </div>
        </div>

        {/* statistic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalRecipes}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stats.pendingRecipes} pending</p>
              </div>
              <BarChart className="h-10 w-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.avgRating}/5.0</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on {stats.totalReviews} reviews</p>
              </div>
              <CheckCircle className="h-10 w-10 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Tabs - Only ONE tab now */}
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

        {/* Users Management  */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Users</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              View all users, change roles, and manage account status
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Joined {user.joinDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-gray-900 dark:text-white"
                      >
                        <option value="user">Regular User</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleUserStatus(user.id, 'inactive')}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center gap-1"
                        >
                          <Lock className="h-3 w-3" />
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserStatus(user.id, 'active')}
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 flex items-center gap-1"
                        >
                          <Unlock className="h-3 w-3" />
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;