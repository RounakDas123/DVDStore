import React,{useState, useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { TfiViewListAlt } from "react-icons/tfi";

import classes from '../navbar/pages/MainNavigation.module.css';
import { cardbuttonsActions } from '../store';

function Wishlistnavbutton() {
  const  [toggleList, setToggleList] = useState(false);
  const openList = () =>{
    setToggleList(!toggleList);
  };  
  const dispatch = useDispatch();


  const changeBadgeValue = useSelector(state => state.cardbuttons.wishlistCounter);

  // Fetch and dispatch the wishlist size only when localStorage changes
  useEffect(() => {
    const wishlistSize = Number(localStorage.getItem('wishlistSize')) || 0;
    dispatch(cardbuttonsActions.setInitialValue({
      type: "wishlist",
      value: wishlistSize
    }));
  }, [dispatch]);

  return (
    <>
    <TfiViewListAlt className={`${!toggleList ? classes.wishlistnav : classes["wishlistnav-active"]}`} onClick={openList} />
    <span className={classes["icon-buttonbadge"]}>{changeBadgeValue}</span>
    </>
  )
};

export default Wishlistnavbutton;