import React, {Suspense} from "react";
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
import Wishlist from "./wishlist/pages/Wishlist";

import PrivateRoute from "./PrivateRoute";
import LoadingSpinner from "./shared/components/loader/LoadingSpinner";
import MainNavigation from "./shared/components/navigation/MainNavigation";
import SearchOverlay from "./shared/components/navigation/SearchOverlay";

// const Cart = React.lazy(() => import('./cart/pages/Cart'));
// const EditProfile = React.lazy(() => import('./edit-profile/pages/EditProfile'));
// const Home = React.lazy(() => import('./home/pages/Home'));
// const Login = React.lazy(() => import('./login-signup/pages/Login'));
// const Wishlist = React.lazy(() => import('./wishlist/pages/Wishlist'));

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

    {/* <Suspense fallback={<LoadingSpinner />}> */}
      <Switch>
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/edit-profile" component={EditProfile} />
        <PrivateRoute path="/wishlist" component={Wishlist} />
        <PrivateRoute path="/cart" component={Cart} />
        <Route exact path="/" component={Login} />
      </Switch>
    {/* </Suspense> */}
    </>
  );
};

export default App;
