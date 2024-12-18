import React from 'react';
import {Link} from 'react-router-dom';

import classes from './MainNavigation.module.css';
import MainHeader from './MainHeader';
import Profilebutton from '../../buttons/Profilebutton';
import SearchBar from './SearchBar';
import Cartnavbutton from '../../buttons/Cartnavbutton';
import Wishlistnavbutton from '../../buttons/Wishlistnavbutton';

function MainNavigation() {
  return (
    <MainHeader>
        {/* <h1 className={classes.title}>
            <Link to="/home">Your Places</Link>
        </h1> */}

        <Link to="/home">
          <img src="logo_mini2.jpg" className={classes.logo}/>
        </Link>
        <div style={{float:"right"}}>
        <div style={{float:"left"}}>  
        <button className={classes["icon-button"]}>
        <Wishlistnavbutton />
        </button>         
        </div>
        <div style={{float:"left"}}>  
        <button className={classes["icon-button"]}>
          <Cartnavbutton />
        </button>  
        </div>
        <div style={{float:"left"}}>  
          <SearchBar />
        </div>
        <div style={{float:"left"}}>  
        <button className={classes["profile-button"]}>
             <Profilebutton />
        </button>
        </div> 
        </div>
    </MainHeader>
  )
};

export default MainNavigation;