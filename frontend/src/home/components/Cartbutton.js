import React from "react";
import { RiShoppingCartFill } from "react-icons/ri";

import classes from "./Cartbutton.module.css";

function Cartbutton({ toggleCart, changeColor }) {
  return (
    <RiShoppingCartFill
      className={`${!toggleCart ? classes.cart : classes["cart-active"]}`}
      onClick={() => {
        changeColor("cart");
      }}
    />
  );
}

export default Cartbutton;
