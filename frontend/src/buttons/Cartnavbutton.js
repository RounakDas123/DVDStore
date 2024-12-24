import React,{useState} from 'react';
import { useSelector } from 'react-redux';
import { BsCart4 } from "react-icons/bs";

import classes from '../navbar/pages/MainNavigation.module.css';

function Cartnavbutton() {
  const  [toggleCart, setToggleCart] = useState(false);
       const openCart = () =>{
        setToggleCart(!toggleCart);
         };  
  const changeBadgeValue = useSelector(state => state.cardbuttons.cartCounter);
  return (
    <>
    <BsCart4 className={`${!toggleCart ? classes.cartnav : classes["cartnav-active"]}`} onClick={openCart} />
    <span className={classes["icon-buttonbadge"]}>{changeBadgeValue}</span>
    </>
  )
};

export default Cartnavbutton;

