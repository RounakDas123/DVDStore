import React from "react";
import { Link } from "react-router-dom";

import Profilebutton from "./Profilebutton";
import Wishlistnavbutton from "./Wishlistnavbutton";
import Cartnavbutton from "./Cartnavbutton";
import MainHeader from "./MainHeader";
import classes from "./MainNavigation.module.css";
import SearchBar from "./SearchBar";

function MainNavigation() {
  return (
    <MainHeader>
      <Link to="/home">
        <img src="logo_mini2.jpg" className={classes.logo} />
      </Link>
      <div style={{ float: "right" }}>
        <div style={{ float: "left" }}>
          <button className={classes["icon-button"]}>
            <Wishlistnavbutton />
          </button>
        </div>
        <div style={{ float: "left" }}>
          <button className={classes["icon-button"]}>
            <Cartnavbutton />
          </button>
        </div>
        <div style={{ float: "left" }}>
          <SearchBar />
        </div>
        <div style={{ float: "left" }}>
          <button className={classes["profile-button"]}>
            <Profilebutton />
          </button>
        </div>
      </div>
    </MainHeader>
  );
}

export default MainNavigation;
