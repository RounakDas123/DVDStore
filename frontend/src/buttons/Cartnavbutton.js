import React,{useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { BsCart4 } from "react-icons/bs";

import classes from '../navbar/pages/MainNavigation.module.css';
import { cardbuttonsActions } from '../store';

function Cartnavbutton() {
  const  [toggleCart, setToggleCart] = useState(false);
       const openCart = () =>{
        setToggleCart(!toggleCart);
         };  
  
  const dispatch = useDispatch();
    const changeBadgeValue = useSelector(state => state.cardbuttons.cartCounter);
  
    // Fetch and dispatch the cart size only when localStorage changes
    useEffect(() => {
      const cartSize = Number(localStorage.getItem('cartSize')) || 0;
      dispatch(cardbuttonsActions.setInitialValue({
        type: "cart",
        value: cartSize
      }));
    }, [dispatch]);

  return (
    <>
    <BsCart4 className={`${!toggleCart ? classes.cartnav : classes["cartnav-active"]}`} onClick={openCart} />
    <span className={classes["icon-buttonbadge"]}>{changeBadgeValue}</span>
    </>
  )
};

export default Cartnavbutton;

