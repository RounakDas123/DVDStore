import React,{useState} from 'react';
import { CgProfile } from "react-icons/cg";

import classes from '../navbar/pages/MainNavigation.module.css';
import DropDownProfile from '../navbar/pages/DropDownProfile';

function Profilebutton() {
    const  [toggleProfile, setToggleProfile] = useState(false);
     const showMenu = () =>{
        setToggleProfile(!toggleProfile);
       };

  return (
    <>
      <CgProfile className={`${!toggleProfile ? classes.profile : classes["profile-active"]}`} onClick={showMenu} />
      {
        toggleProfile && <DropDownProfile/>
      }     
    </>
    )
};

export default Profilebutton;