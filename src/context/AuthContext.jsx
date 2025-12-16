import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Initialize token from localStorage
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // Save user and token to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Login function
  const login = async (email, password, userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll create a simple user object
      const demoUser = userData || {
        id: Date.now(),
        firstName: 'Rana',
        lastName: 'Ahmed',
        email: email,
        bio: 'Welcome to RecipeFinder!',
        avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      
      // Generate a simple token (in real app, this comes from backend)
      const demoToken = `demo-token-${Date.now()}`;
      
      setUser(demoUser);
      setToken(demoToken);
      
      return { success: true, user: demoUser };
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now(),
        ...userData,
        bio: 'Love cooking healthy meals and trying new recipes!',
        avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      
      // Generate a simple token
      const demoToken = `demo-token-${Date.now()}`;
      
      setUser(newUser);
      setToken(demoToken);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, message: 'Signup failed' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};