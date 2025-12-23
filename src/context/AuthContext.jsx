import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  });

  // Initialize token from localStorage
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // Track loading state
  const [isLoading, setIsLoading] = useState(false);

  // Save user and token to localStorage whenever they change
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load all users from localStorage
  const getAllUsers = useCallback(() => {
    try {
      const users = localStorage.getItem('registeredUsers');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
      return [];
    }
  }, []);

  // Save users to localStorage
  const saveAllUsers = useCallback((users) => {
    try {
      localStorage.setItem('registeredUsers', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }, []);

  // Initialize with default users if not exists
  useEffect(() => {
    const users = getAllUsers();
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: 1,
          email: 'admin@recipefinder.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          bio: 'System administrator with full access to all features.',
          avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
          joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        },
        {
          id: 2,
          email: 'rana.ahmed@zewailcity.edu.eg',
          password: 'rana123',
          firstName: 'Rana',
          lastName: 'Ahmed',
          role: 'user',
          bio: 'Love cooking healthy meals and trying new recipes!',
          avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
          joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        }
      ];
      saveAllUsers(defaultUsers);
    }
  }, [getAllUsers, saveAllUsers]);

  // Initialize user's data storage
  const initializeUserData = useCallback((userId) => {
    try {
      const userKey = `user_${userId}_data`;
      if (!localStorage.getItem(userKey)) {
        const initialData = {
          favorites: [],
          mealPlan: [],
          customRecipes: [],
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(userKey, JSON.stringify(initialData));
        console.log(`Initialized data for user ${userId}`);
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
    }
  }, []);

  // Get current user's data - IMMEDIATELY from localStorage
  const getUserData = useCallback(() => {
    if (!user) return { favorites: [], mealPlan: [], customRecipes: [] };
    
    try {
      const userKey = `user_${user.id}_data`;
      const data = localStorage.getItem(userKey);
      
      if (data) {
        const parsed = JSON.parse(data);
        // Ensure the data structure is correct
        return {
          favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
          mealPlan: Array.isArray(parsed.mealPlan) ? parsed.mealPlan : [],
          customRecipes: Array.isArray(parsed.customRecipes) ? parsed.customRecipes : [],
          lastUpdated: parsed.lastUpdated || new Date().toISOString()
        };
      } else {
        // If no data exists, initialize it
        initializeUserData(user.id);
        return { favorites: [], mealPlan: [], customRecipes: [] };
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return { favorites: [], mealPlan: [], customRecipes: [] };
    }
  }, [user, initializeUserData]);

  // Update current user's data - IMMEDIATELY to localStorage
  const updateUserData = useCallback((newData) => {
    if (!user) {
      console.warn('Cannot update user data: No user logged in');
      return;
    }
    
    try {
      const userKey = `user_${user.id}_data`;
      const currentData = getUserData();
      const updatedData = { 
        ...currentData, 
        ...newData,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(userKey, JSON.stringify(updatedData));
      console.log(`Updated data for user ${user.id}:`, updatedData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  }, [user, getUserData]);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get all registered users
      const allUsers = getAllUsers();
      
      // Check if user exists
      const foundUser = allUsers.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
      );
      
      if (foundUser) {
        const userData = {
          ...foundUser,
          password: undefined // Don't store password in user object
        };
        
        // Generate a simple token
        const demoToken = `demo-token-${Date.now()}-${userData.role}`;
        
        setUser(userData);
        setToken(demoToken);
        
        // Initialize user's data if not exists
        initializeUserData(userData.id);
        
        console.log(`User ${userData.email} logged in successfully`);
        
        return { 
          success: true, 
          user: userData,
          message: `Welcome back, ${userData.firstName}!`
        };
      } else {
        return { 
          success: false, 
          message: 'Invalid email or password. Please try again or sign up.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get all registered users
      const allUsers = getAllUsers();
      
      // Check if email already exists
      const emailExists = allUsers.some(user => 
        user.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (emailExists) {
        return { 
          success: false, 
          message: 'Email already registered. Please use a different email or login.' 
        };
      }
      
      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'user', // All new signups get 'user' role by default
        bio: 'Love cooking healthy meals and trying new recipes!',
        avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      
      // Add new user to registered users
      allUsers.push(newUser);
      saveAllUsers(allUsers);
      
      // Generate a simple token
      const demoToken = `demo-token-${Date.now()}-user`;
      
      setUser(newUser);
      setToken(demoToken);
      
      // Initialize user's data
      initializeUserData(newUser.id);
      
      console.log(`New user ${newUser.email} registered successfully`);
      
      return { 
        success: true, 
        user: newUser,
        message: `Account created successfully! Welcome, ${newUser.firstName}!`
      };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: 'Signup failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    console.log(`User ${user?.email} logging out`);
    setUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }, [user]);

  // Update user profile
  const updateProfile = useCallback((updatedData) => {
    if (!user) return;
    
    // Update in current user state
    setUser(prev => ({ ...prev, ...updatedData }));
    
    // Update in registered users storage
    const allUsers = getAllUsers();
    const updatedUsers = allUsers.map(u => 
      u.id === user.id ? { ...u, ...updatedData } : u
    );
    saveAllUsers(updatedUsers);
  }, [user, getAllUsers, saveAllUsers]);

  // Update user role (admin only function)
  const updateUserRole = useCallback((userId, newRole) => {
    if (!user || user.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }
    
    const allUsers = getAllUsers();
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    );
    saveAllUsers(updatedUsers);
    
    // Update current user if it's the same user
    if (user.id === userId) {
      setUser(prev => ({ ...prev, role: newRole }));
    }
    
    console.log(`User ${userId} role updated to ${newRole}`);
    
    return { success: true, message: 'Role updated successfully' };
  }, [user, getAllUsers, saveAllUsers]);

  // Get all users (admin only)
  const getAllRegisteredUsers = useCallback(() => {
    if (!user || user.role !== 'admin') return [];
    return getAllUsers();
  }, [user, getAllUsers]);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user has specific role
  const hasRole = useCallback((requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  // Check if user is regular user
  const isUser = useCallback(() => {
    return hasRole('user');
  }, [hasRole]);

  // Sync user data on mount (for when user refreshes page)
  useEffect(() => {
    if (user) {
      // Make sure user data is initialized
      initializeUserData(user.id);
      
      // Load and verify user exists in registered users
      const allUsers = getAllUsers();
      const userExists = allUsers.some(u => u.id === user.id);
      
      if (!userExists) {
        console.warn('User not found in registered users, logging out');
        logout();
      }
    }
  }, [user, initializeUserData, getAllUsers, logout]);

  // Debug function to check all user data
  const debugUserData = useCallback(() => {
    if (!user) return null;
    
    const userKey = `user_${user.id}_data`;
    const data = localStorage.getItem(userKey);
    
    return {
      userKey,
      userData: data ? JSON.parse(data) : null,
      currentUser: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null,
      allUsers: getAllUsers(),
      localStorageKeys: Object.keys(localStorage)
    };
  }, [user, getAllUsers]);

  // Clear all data (for debugging)
  const clearAllData = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    console.log('All data cleared');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        updateUserRole,
        getAllRegisteredUsers,
        getUserData,
        updateUserData,
        isAuthenticated,
        hasRole,
        isAdmin,
        isUser,
        debugUserData,
        clearAllData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};