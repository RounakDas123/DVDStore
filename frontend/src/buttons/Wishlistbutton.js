import React,{useState} from 'react';
import { RiHeart3Fill } from "react-icons/ri";

import classes from '../home/pages/Home.module.css';

function Wishlistbutton({toggleHeart,changeColor}) {

//     const  [toggleHeart, setToggleHeart] = useState(false);
//  const changeColor = () =>{
//     setToggleHeart(!toggleHeart);
//    };

  return (
    <RiHeart3Fill className={`${!toggleHeart ? classes.heart : classes["heart-active"]}`} onClick={() => {changeColor("wishlist")}} />
  )
}

export default Wishlistbutton