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

  // Predefined users for demo
  const predefinedUsers = [
    {
      email: 'admin@recipefinder.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      bio: 'System administrator with full access to all features.',
      avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    },
    {
      email: 'rana.ahmed@zewailcity.edu.eg',
      password: 'rana123',
      firstName: 'Rana',
      lastName: 'Ahmed',
      role: 'user',
      bio: 'Love cooking healthy meals and trying new recipes!',
      avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
    }
  ];

  // Login function
  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in predefined users
      const foundUser = predefinedUsers.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        user.password === password
      );
      
      if (foundUser) {
        const userData = {
          id: Date.now(),
          ...foundUser,
          password: undefined, // Don't store password in user object
          joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
        
        // Generate a simple token
        const demoToken = `demo-token-${Date.now()}-${userData.role}`;
        
        setUser(userData);
        setToken(demoToken);
        
        return { 
          success: true, 
          user: userData,
          message: `Welcome back, ${userData.firstName}!`
        };
      } else {
        // For demo, create a new user if not in predefined list
        const emailName = email.split('@')[0];
        const firstName = emailName.split('.')[0] || 'User';
        const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        
        const newUser = {
          id: Date.now(),
          firstName: formattedFirstName,
          lastName: 'User',
          email: email,
          role: 'user', // Default role for new users
          bio: `Welcome to RecipeFinder, ${formattedFirstName}! Love cooking healthy meals and trying new recipes.`,
          avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
          joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
        
        // Special case for Rana's email
        if (email.toLowerCase().includes('rana')) {
          newUser.firstName = 'Rana';
          newUser.lastName = 'Ahmed';
        }
        
        const demoToken = `demo-token-${Date.now()}-user`;
        
        setUser(newUser);
        setToken(demoToken);
        
        return { 
          success: true, 
          user: newUser,
          message: `Welcome, ${newUser.firstName}! Account created successfully.`
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Login failed. Please check your credentials and try again.' 
      };
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
        role: 'user', // All new signups get 'user' role by default
        bio: 'Love cooking healthy meals and trying new recipes!',
        avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
      
      // Generate a simple token
      const demoToken = `demo-token-${Date.now()}-user`;
      
      setUser(newUser);
      setToken(demoToken);
      
      return { 
        success: true, 
        user: newUser,
        message: `Account created successfully! Welcome, ${newUser.firstName}!`
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Signup failed. Please try again.' 
      };
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

  // Update user role (admin only function)
  const updateUserRole = (userId, newRole) => {
    // In a real app, this would call an API
    // For demo, we'll just update current user if it matches
    if (user && user.id === userId) {
      setUser(prev => ({ ...prev, role: newRole }));
      return { success: true, message: 'Role updated successfully' };
    }
    return { success: false, message: 'User not found' };
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user is regular user
  const isUser = () => {
    return hasRole('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        updateProfile,
        updateUserRole,
        isAuthenticated,
        hasRole,
        isAdmin,
        isUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};