import React,{useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { BsCart4 } from "react-icons/bs";
import { useHistory, useLocation } from "react-router-dom";

import classes from '../navbar/pages/MainNavigation.module.css';
import { cardbuttonsActions } from '../store';

function Cartnavbutton() {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const isActive = location.pathname === "/cart";
  
    const changeBadgeValue = useSelector(state => state.cardbuttons.cartCounter);
  
    // Fetch and dispatch the cart size only when localStorage changes
    useEffect(() => {
      const cartSize = Number(localStorage.getItem('cartSize')) || 0;
      dispatch(cardbuttonsActions.setInitialValue({
        type: "cart",
        value: cartSize
      }));
    }, [dispatch]);

    const openCart = () => {
      history.push("/cart"); // Always navigate to /cart
    };

  return (
    <>
    <BsCart4
        className={`${isActive ? classes["cartnav-active"] : classes.cartnav}`}
        onClick={openCart}
      />
      <span className={classes["icon-buttonbadge"]}>{changeBadgeValue}</span>
    </>
  )
};

export default Cartnavbutton;

