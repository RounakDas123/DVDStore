import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './login-signup/pages/Login';
import Home from './home/pages/Home';
import MainNavigation from './navbar/pages/MainNavigation';
import EditProfile from './home/pages/EditProfile';
import Wishlist from './wishlist/pages/Wishlist';
import Cart from './cart/pages/Cart';
import PrivateRoute from './PrivateRoute';

function App() {


  return (
  <Router>
    <AppLayout />
  </Router>
  );
}

const AppLayout = () => {
  const location = useLocation();

  // Hide navbar on login page
  const shouldHideNavbar = location.pathname === "/";

  return (
    <>
      {/* Conditionally render the MainNavigation */}
      {!shouldHideNavbar && <MainNavigation />}
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover={false} 
        draggable={false} 
        theme="colored" 
      />

      <Switch>
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/edit-profile" component={EditProfile} />
        <PrivateRoute path="/wishlist" component={Wishlist} />
        <PrivateRoute path="/cart" component={Cart} />
        <Route exact path="/" component={Login} />
      </Switch>
    </>
  );
};

export default App;
