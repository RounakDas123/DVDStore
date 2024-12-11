import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Login from './login-signup/pages/Login';

function App() {
  return (
  <Router>
    <Switch>
      <Route path="/" exact>
        <Login />
      </Route>
      <Redirect to="/" />
    </Switch> 
  </Router>
  );
}

export default App;
