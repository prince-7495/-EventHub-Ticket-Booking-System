import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute Component
// Handles authentication and role-based authorization
// - No token: redirect to / (login page)
// - Token but wrong role: redirect to /events (events page)
// - Token and correct role: render component

const ProtectedRoute = ({ component: Component, requiredRole = null }) => {
  const { token, role } = useAuth();

  // No authentication token - redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Has token but requires specific role and doesn't have it
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/events" replace />;
  }

  // All checks passed - render component
  return <Component />;
};

export default ProtectedRoute;
