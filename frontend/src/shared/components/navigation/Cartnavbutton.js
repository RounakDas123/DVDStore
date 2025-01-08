import React, { useEffect } from "react";
import { BsCart4 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import { cardbuttonsActions } from "../../../store";

function Cartnavbutton() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const isActive = location.pathname === "/cart";

  const changeBadgeValue = useSelector(
    (state) => state.cardbuttons.cartCounter
  );

  // Fetch and dispatch the cart size only when localStorage changes
  useEffect(() => {
    const cartSize = Number(localStorage.getItem("cartSize")) || 0;
    dispatch(
      cardbuttonsActions.setInitialValue({
        type: "cart",
        value: cartSize,
      })
    );
  }, [dispatch]);

  const openCart = () => {
    history.push("/cart");
  };

  return (
    <>
      <BsCart4
        className={`${isActive ? classes["cartnav-active"] : classes.cartnav}`}
        onClick={openCart}
      />
      <span className={classes["icon-buttonbadge"]}>{changeBadgeValue}</span>
    </>
  );
}

export default Cartnavbutton;
