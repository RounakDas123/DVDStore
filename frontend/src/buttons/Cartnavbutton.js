import React,{useState} from 'react';
import { BsCart4 } from "react-icons/bs";

import classes from '../navbar/pages/MainNavigation.module.css';

function Cartnavbutton() {
  const  [toggleCart, setToggleCart] = useState(false);
       const openCart = () =>{
        setToggleCart(!toggleCart);
         };  

  return (
    <>
    <BsCart4 className={`${!toggleCart ? classes.cartnav : classes["cartnav-active"]}`} onClick={openCart} />
    <span className={classes["icon-buttonbadge"]}>2</span>
    </>
  )
};

export default Cartnavbutton;

