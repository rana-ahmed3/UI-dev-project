import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleBasedContent = ({ children, requiredRoles = [], fallback = null }) => {
  const { hasAnyRole } = useAuth();

  if (requiredRoles.length === 0 || hasAnyRole(requiredRoles)) {
    return <>{children}</>;
  }

  return fallback;
};

export default RoleBasedContent;