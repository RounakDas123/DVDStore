import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
// import { isAuthenticated } from './utils/authUtils';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
    return decodedToken.exp > currentTime; // Check if the token is expired
  } catch (error) {
    return false;
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
  
  export default PrivateRoute;