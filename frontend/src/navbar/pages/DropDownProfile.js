import React from 'react';

import classes from './DropDownProfile.module.css';

function DropDownProfile() {
  return (
    <div className={classes.dropdown}>
        <ul style={{display: "flex", flexDirection: "column", gap: "1rem", listStyleType: "none"}}>
            <li>Edit Profile</li>
            <li>Logout</li>
        </ul>
    </div>
  )
};

export default DropDownProfile;