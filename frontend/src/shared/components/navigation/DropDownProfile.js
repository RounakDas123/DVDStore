import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { VscSignOut } from "react-icons/vsc";
import { MdPlaylistAddCheck } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import {
  cardbuttonsActions,
  userInfoActions,
  wishlistCartActions,
} from "../../../store";
import classes from "./DropDownProfile.module.css";

function DropDownProfile({ onClick }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const handleLogout = () => {
    onClick(); // Close the dropdown
    toast.success("You have successfully logged out!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
    dispatch(
      userInfoActions.setUserInfo({
        user: {},
        token: null,
      })
    );
    dispatch(
      cardbuttonsActions.setInitialValue({
        type: "wishlist",
        value: 0,
      })
    );
    dispatch(
      cardbuttonsActions.setInitialValue({
        type: "cart",
        value: 0,
      })
    );
    dispatch(
      wishlistCartActions.setInitialValue({
        type: "wishlist",
        value: [],
      })
    );
    dispatch(
      wishlistCartActions.setInitialValue({
        type: "cart",
        value: [],
      })
    );

    localStorage.removeItem("userinfo");
    localStorage.removeItem("token");
    localStorage.removeItem("wishlistSize");
    localStorage.removeItem("cartSize");
    localStorage.removeItem("wishlist");
    localStorage.removeItem("cart");

    history.push("/");
  };

  return (
    <div className={classes.dropdown}>
      <ul className={classes.list}>
        <li>
          <Link
            to="/edit-profile"
            className={classes["sub-menu-link"]}
            onClick={onClick}
          >
            <div className={classes.icon}>
              <FaUserAlt />
            </div>
            <p>Edit Profile</p>
            <span>{">"}</span>
          </Link>
        </li>
        <li>
          <Link
            to="/transactions"
            className={classes["sub-menu-link"]}
            onClick={onClick}
          >
            <div className={classes.icon}>
              <MdPlaylistAddCheck />
            </div>
            <p>Transactions</p>
            <span>{">"}</span>
          </Link>
        </li>
        <li>
          <a
            href="#"
            className={classes["sub-menu-link"]}
            onClick={handleLogout}
          >
            <div className={classes.icon}>
              <VscSignOut />
            </div>
            <p>Logout</p>
            <span>{">"}</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default DropDownProfile;