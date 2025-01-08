import React, { useEffect } from "react";
import { TfiViewListAlt } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import { cardbuttonsActions } from "../../../store";

function Wishlistnavbutton() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const isActive = location.pathname === "/wishlist";

  const changeBadgeValue = useSelector(
    (state) => state.cardbuttons.wishlistCounter
  );

  // Fetch and dispatch the wishlist size only when localStorage changes
  useEffect(() => {
    const wishlistSize = Number(localStorage.getItem("wishlistSize")) || 0;
    dispatch(
      cardbuttonsActions.setInitialValue({
        type: "wishlist",
        value: wishlistSize,
      })
    );
  }, [dispatch]);

  const openWishlist = () => {
    history.push("/wishlist");
  };

  return (
    <>
      <TfiViewListAlt
        className={`${
          isActive ? classes["wishlistnav-active"] : classes.wishlistnav
        }`}
        onClick={openWishlist}
      />
      <span className={classes["icon-buttonbadge"]}>{changeBadgeValue}</span>
    </>
  );
}

export default Wishlistnavbutton;
