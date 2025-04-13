import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { authState } = useAuth();
  
  return authState.isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute; 