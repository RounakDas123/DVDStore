import React,{useState} from 'react';
import { RiShoppingCartFill } from "react-icons/ri";

import classes from '../home/pages/Home.module.css';

function Cartbutton() {
    const  [toggleCart, setToggleCart] = useState(false);
    const changeColor = () =>{
        setToggleCart(!toggleCart);
       };

  return (
      <RiShoppingCartFill className={`${!toggleCart ? classes.cart : classes["cart-active"]}`} onClick={changeColor} />
    )
}

export default Cartbutton;