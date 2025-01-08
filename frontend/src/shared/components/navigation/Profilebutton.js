import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";

import DropDownProfile from "./DropDownProfile";
import classes from "./MainNavigation.module.css";

function Profilebutton() {
  const [toggleProfile, setToggleProfile] = useState(false);
  const showMenu = () => {
    setToggleProfile(!toggleProfile);
  };

  return (
    <>
      <CgProfile
        className={`${
          !toggleProfile ? classes.profile : classes["profile-active"]
        }`}
        onClick={showMenu}
      />
      {toggleProfile && <DropDownProfile onClick={showMenu} />}
    </>
  );
}

export default Profilebutton;
