import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated, selectCurrentUser } from '../redux/authSlice';

const ProtectedRoute = ({ adminOnly }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser?.role !== 'admin') {
      
      return <Navigate to="/unauthorized" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;