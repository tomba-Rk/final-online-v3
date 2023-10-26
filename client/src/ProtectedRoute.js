// ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase.js';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return <Route {...rest} element={Component} />;
};

export default ProtectedRoute;
