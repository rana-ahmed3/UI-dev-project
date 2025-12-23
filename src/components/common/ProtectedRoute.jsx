import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If route requires admin role but user is not admin
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Allow access to all authenticated users for non-admin routes
  return children;
};

export default ProtectedRoute;