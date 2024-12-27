import React,{useState} from 'react';
import { RiShoppingCartFill } from "react-icons/ri";


import classes from '../home/pages/Home.module.css';

function Cartbutton({toggleCart,changeColor}) {
    // const  [toggleCart, setToggleCart] = useState(false);
    // const changeColor = () =>{
    //     setToggleCart(!toggleCart);
    //    };

  return (
      <RiShoppingCartFill className={`${!toggleCart ? classes.cart : classes["cart-active"]}`} onClick={() => {changeColor("cart")}} />
    )
}

export default Cartbutton;