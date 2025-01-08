import React from "react";

import classes from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={classes["loading-spinner__overlay"]}>
      <div className={classes["lds-dual-ring"]}>
        <img
          src="./loader.svg"
          alt="loader"
          style={{ width: "370", height: "290" }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
