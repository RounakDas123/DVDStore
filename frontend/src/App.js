import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, useLocation } from 'react-router-dom';

import Login from './login-signup/pages/Login';
import Home from './home/pages/Home';
import MainNavigation from './navbar/pages/MainNavigation';
import EditProfile from './home/pages/EditProfile';

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
      
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/edit-profile" component={EditProfile} />
        <Route exact path="/" component={Login} />
      </Switch>
    </>
  );
};

export default App;
