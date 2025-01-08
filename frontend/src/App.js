import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Cart from "./cart/pages/Cart";
import EditProfile from "./edit-profile/pages/EditProfile";
import Home from "./home/pages/Home";
import Login from "./login-signup/pages/Login";
import PrivateRoute from "./PrivateRoute";
import MainNavigation from "./shared/components/navigation/MainNavigation";
import SearchOverlay from "./shared/components/navigation/SearchOverlay";
import Wishlist from "./wishlist/pages/Wishlist";

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
      {!shouldHideNavbar && <MainNavigation />}
      <SearchOverlay />
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
