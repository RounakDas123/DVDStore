import React from 'react';
import { FaUserAlt } from "react-icons/fa"; 
import { VscSignOut } from "react-icons/vsc"; 
import { Link,useHistory } from "react-router-dom";
import { toast } from 'react-toastify';

import classes from './DropDownProfile.module.css';

function DropDownProfile({onClick}) { 
  const history = useHistory();
  const handleLogout = () => {
    onClick(); // Close the dropdown
    toast.success("You have successfully logged out!",{
      position: "top-center", 
      autoClose: 3000, 
      hideProgressBar: false, 
      closeOnClick: true, 
      pauseOnHover: false, 
      draggable: false, 
    });
    setTimeout(() => {
      history.push('/'); // Redirect to the login page
    }, 1000); // Delay to allow toast to display
  };

  return (
    <div className={classes.dropdown}>
        <ul className={classes.list}>
            <li>
            <Link to="/edit-profile" className={classes["sub-menu-link"]} onClick={onClick}>
              <div className={classes.icon}><FaUserAlt /></div>             
                <p>Edit Profile</p>
                <span>{'>'}</span>
              </Link>
            </li>
            <li>
              <a href="#" className={classes["sub-menu-link"]} onClick={handleLogout}>
                <div className={classes.icon}><VscSignOut /></div>
                <p>Logout</p>
                <span>{'>'}</span>
              </a>
            </li>
        </ul>
    </div>
  )
};

export default DropDownProfile;