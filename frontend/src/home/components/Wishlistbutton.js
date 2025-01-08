import React from "react";
import { RiHeart3Fill } from "react-icons/ri";

import classes from "./Wishlistbutton.module.css";

function Wishlistbutton({ toggleHeart, changeColor }) {
  return (
    <RiHeart3Fill
      className={`${!toggleHeart ? classes.heart : classes["heart-active"]}`}
      onClick={() => {
        changeColor("wishlist");
      }}
    />
  );
}

export default Wishlistbutton;
