import React,{useState} from 'react';
import { useSelector } from 'react-redux';
import { TfiViewListAlt } from "react-icons/tfi";

import classes from '../navbar/pages/MainNavigation.module.css';

function Wishlistnavbutton() {
  const  [toggleList, setToggleList] = useState(false);
       const openList = () =>{
        setToggleList(!toggleList);
         };  
  const changeBadgeValue = useSelector(state => state.cardbuttons.wishlistCounter);
  return (
    <>
    <TfiViewListAlt className={`${!toggleList ? classes.wishlistnav : classes["wishlistnav-active"]}`} onClick={openList} />
    <span className={classes["icon-buttonbadge"]}>{changeBadgeValue}</span>
    </>
  )
};

export default Wishlistnavbutton;