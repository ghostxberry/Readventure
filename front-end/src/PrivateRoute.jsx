import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import AppContext from './AppContext'; // Import your AppContext to access authentication status

// PrivateRoute component
const PrivateRoute = ({ element: Element, ...rest }) => {
  const { session } = useContext(AppContext); // Access authentication status from context

  // If user is authenticated, render the original component; otherwise, redirect to login page
  return (
    <Route
      {...rest}
      element={session.loggedIn ? <Element /> : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
