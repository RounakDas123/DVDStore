import React,{useState} from 'react';
import { TfiViewListAlt } from "react-icons/tfi";

import classes from '../navbar/pages/MainNavigation.module.css';

function Wishlistnavbutton() {
  const  [toggleList, setToggleList] = useState(false);
       const openList = () =>{
        setToggleList(!toggleList);
         };  

  return (
    <>
    <TfiViewListAlt className={`${!toggleList ? classes.wishlistnav : classes["wishlistnav-active"]}`} onClick={openList} />
    <span className={classes["icon-buttonbadge"]}>2</span>
    </>
  )
};

export default Wishlistnavbutton;