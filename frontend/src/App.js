import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Login from './login-signup/pages/Login';
import Home from './home/pages/Home';

function App() {


  return (
  <Router>
    <Switch>
      <Route path="/" exact>
        <Login />
      </Route>
      <Route path="/home" exact>
        <Home />
      </Route>
      <Redirect to="/" />
    </Switch> 
  </Router>
  );
}

export default App;
