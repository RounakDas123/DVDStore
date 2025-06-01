import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import {
  cardbuttonsActions,
  userInfoActions,
  wishlistCartActions,
} from "../../store";
import classes from "./Login.module.css";

const Login = () => {
  useEffect(() => {
    document.body.classList.add(`${classes["body-style"]}`); // here explicitly setting the style for body, root for this component only.
    document
      .getElementById("root")
      .classList.add(`${classes["container-root"]}`);
  }, []);

  const navigate = useHistory();
  const dispatch = useDispatch();

  const [loginValues, setLoginValues] = useState({
    //for updating state of login page inputs
    email: "",
    password: "",
    pwd_show: true,
  });

  const [signupValues, setSignupValues] = useState({
    //for updating state of signup page inputs
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    pwd_show: true,
    conf_pwd_show: true,
  });

  const [pwdNotEqual, setPwdNotEqual] = useState(false);

  const [didEdit, setDidEdit] = useState({
    //used for checking if input is edited, i.e. losing focus or not
    login: {
      email: false,
    },
    signup: {
      name: false,
      email: false,
    },
  });

  const [otpState, setOtpState] = useState({
    email: "",
    otp: "",
    isOtpSent: false,
    isVerifying: false,
    countdown: 0,
  });

  useEffect(() => {
  setOtpState(prev => ({
    ...prev,
    otp: "",
    isOtpSent: false,
    countdown: 0
  }));
}, [signupValues.email]);

  const emailLoginIsInvalid =
    didEdit.login.email && !loginValues.email.includes("@"); //for validation login email
  const nameSignupIsInvalid =
    didEdit.signup.name && !signupValues.name.match(/^[a-zA-Z]+$/); //for validation signup name
  const emailSignupIsInvalid =
    didEdit.signup.email && !signupValues.email.includes("@"); //for validation signup email

  async function handleSubmit(event) {
    // this function is called when submitting the form
    event.preventDefault();
    var buttonName = event.nativeEvent.submitter.name;
    if (buttonName === "login") {
      try {
        const response = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_id: loginValues.email,
            password: loginValues.password,
          }),
        });
        const responseData = await response.json();
        if (!responseData.ok && !responseData.user) {
          toast.error(responseData.message);
          return;
        }
        toast.success(responseData.message);
        dispatch(
          userInfoActions.setUserInfo({
            user: responseData.user,
            token: responseData.token,
          })
        );
        if (responseData.token) {
          localStorage.setItem("userinfo", JSON.stringify(responseData.user));
          localStorage.setItem("token", responseData.token);
        }

        const response_wsize = await fetch(
          `http://localhost:5000/api/wishlist/size/${responseData.user.id}`,
          { headers: { Authorization: "Bearer " + responseData.token } }
        );
        const responseData_wsize = await response_wsize.json();

        if (
          !responseData_wsize.ok &&
          (responseData_wsize.wishlistSize === null ||
            responseData_wsize.wishlistSize === undefined)
        ) {
          toast.error(responseData_wsize.message);
          return;
        }
        dispatch(
          cardbuttonsActions.setInitialValue({
            type: "wishlist",
            value: responseData_wsize.wishlistSize,
          })
        );
        if (
          responseData_wsize.wishlistSize !== null &&
          responseData_wsize.wishlistSize !== undefined
        ) {
          localStorage.setItem("wishlistSize", responseData_wsize.wishlistSize);
        }

        const response_csize = await fetch(
          `http://localhost:5000/api/cart/size/${responseData.user.id}`,
          { headers: { Authorization: "Bearer " + responseData.token } }
        );
        const responseData_csize = await response_csize.json();

        if (
          !responseData_csize.ok &&
          (responseData_csize.cartSize === null ||
            responseData_csize.cartSize === undefined)
        ) {
          toast.error(responseData_csize.message);
          return;
        }
        dispatch(
          cardbuttonsActions.setInitialValue({
            type: "cart",
            value: responseData_csize.cartSize,
          })
        );
        if (
          responseData_csize.cartSize !== null &&
          responseData_csize.cartSize !== undefined
        ) {
          localStorage.setItem("cartSize", responseData_csize.cartSize);
        }

        const wishlist = await fetch(
          `http://localhost:5000/api/wishlist/user/${responseData.user.id}`,
          { headers: { Authorization: "Bearer " + responseData.token } }
        );
        const responseData_wishlist = await wishlist.json();

        if (!responseData_wishlist.ok && !responseData_wishlist.wishlist) {
          toast.error(responseData_wishlist.message);
          return;
        }
        dispatch(
          wishlistCartActions.setInitialValue({
            type: "wishlist",
            value: responseData_wishlist.wishlist.movie_tv,
          })
        );
        if (
          responseData_wishlist.wishlist !== null &&
          responseData_wishlist.wishlist !== undefined &&
          responseData_wishlist.wishlist.movie_tv !== null &&
          responseData_wishlist.wishlist.movie_tv !== undefined
        ) {
          localStorage.setItem(
            "wishlist",
            JSON.stringify(responseData_wishlist.wishlist.movie_tv)
          );
        }

        const cart = await fetch(
          `http://localhost:5000/api/cart/user/${responseData.user.id}`,
          { headers: { Authorization: "Bearer " + responseData.token } }
        );
        const responseData_cart = await cart.json();

        if (!responseData_cart.ok && !responseData_cart.cart) {
          toast.error(responseData_cart.message);
          return;
        }
        dispatch(
          wishlistCartActions.setInitialValue({
            type: "cart",
            value: responseData_cart.cart.movie_tv,
          })
        );
        if (
          responseData_cart.cart !== null &&
          responseData_cart.cart !== undefined
        ) {
          localStorage.setItem(
            "cart",
            JSON.stringify(responseData_cart.cart.movie_tv)
          );
        }
      } catch (err) {
        console.log(err);
      }

      setLoginValues({
        //for setting all the fields to initial state, i.e, resetting the form after successful submission.
        email: "",
        password: "",
        pwd_show: true,
      });

      document.body.classList.remove(`${classes["body-style"]}`); // this is done to remove the styles of body,root before redirecting.
      document
        .getElementById("root")
        .classList.remove(`${classes["container-root"]}`);
      navigate.push("/home");
    } else if (buttonName === "signup") {
      if (signupValues.password !== signupValues.confirm_password) {
        setPwdNotEqual(true);
        return;
      }
      if (!otpState.isOtpSent || otpState.otp.length !== 6) {
        toast.error("Please enter valid 6-digit code");
        return;
      }

      try {
        const verifyResponse = await fetch("http://localhost:5000/api/otp/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: signupValues.email,
            otp: otpState.otp,
          }),
        });
    
        const verifyData = await verifyResponse.json();
        
        if (!verifyResponse.ok || !verifyData.otp) {
          toast.error(verifyData.message || "Invalid OTP. Please try again.");
          return;
        }

        const response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: signupValues.name,
            email_id: signupValues.email,
            password: signupValues.password,
          }),
        });
        const responseData = await response.json();

        if (!responseData.ok && !responseData.user) {
          toast.error(responseData.message);
          return;
        }
        toast.success(responseData.message);
      } catch (err) {
        console.log(err);
      }

      setSignupValues({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        pwd_show: true,
        conf_pwd_show: true,
      });
      // Flip the checkbox for signup
      const flipCheckbox = document.getElementById(classes.flip);
      if (flipCheckbox) {
        var state = flipCheckbox.checked;
        flipCheckbox.checked = !state; // Set the checkbox to checked
      }
    }
    setDidEdit({
      // setting the states for checking edited or not to initial values
      login: {
        email: false,
      },
      signup: {
        name: false,
        email: false,
      },
    });
  }

  function handleInputChange(section, identifier, value) {
    //this function is called on every keystroke in input element(onChange event)
    if (section === "login") {
      setLoginValues((prevValues) => ({
        ...prevValues,
        [identifier]: value,
      }));
    } else if (section === "signup") {
      setSignupValues((prevValues) => ({
        ...prevValues,
        [identifier]: value,
      }));
    }

    setDidEdit((prevEdit) => ({
      // this is done to remove the error message as soon as user starts typing again.
      ...prevEdit,
      [section]: { ...prevEdit[section], [identifier]: false },
    }));
  }

  function handleInputBlur(section, identifier) {
    //this function is called when input element loses focus.(onBlur event)
    setDidEdit((prevEdit) => ({
      // this is done to show the error message(if any) as soon as input element loses focus.
      ...prevEdit,
      [section]: { ...prevEdit[section], [identifier]: true },
    }));
  }

  function handleShowPassword(section, identifier) {
    //this function is called to show or hide the password
    if (section === "login") {
      setLoginValues((prevValues) => {
        var showpwd = !prevValues.pwd_show; // this is done to reverse the previous state of pwd_show to toggle between true-false
        return {
          ...prevValues,
          [identifier]: showpwd,
        };
      });
    } else if (section === "signup") {
      if (identifier === "pwd_show") {
        setSignupValues((prevValues) => {
          var showpwd = !prevValues.pwd_show;
          return {
            ...prevValues,
            [identifier]: showpwd,
          };
        });
      } else if (identifier === "conf_pwd_show") {
        setSignupValues((prevValues) => {
          var showconfpwd = !prevValues.conf_pwd_show;
          return {
            ...prevValues,
            [identifier]: showconfpwd,
          };
        });
      }
    }
  }

  function resetForm(id) {
    if (id === "signup") {
      setSignupValues({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        pwd_show: true,
        conf_pwd_show: true,
      });
    } else if (id === "login") {
      setLoginValues({
        //for setting all the fields to initial state, i.e, resetting the form
        email: "",
        password: "",
        pwd_show: true,
      });
    }
  }


const generateAndSendOtp = async () => {
  // if (!loginValues.email.includes("@")) {
  //   toast.error("Please enter a valid email address");
  //   return;
  // }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const response = await fetch("http://localhost:5000/api/otp/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: signupValues.email,
        otp: otp,
      }),
    });

    if (!response.ok && !response.otp) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send OTP");
    }

    setOtpState({
      email: signupValues.email,
      otp: "",
      isOtpSent: true,
      isVerifying: false,
      countdown: 30, 
    });

    const timer = setInterval(() => {
      setOtpState(prev => {
        if (prev.countdown <= 1) {
          clearInterval(timer);
          return {...prev, countdown: 0};
        }
        return {...prev, countdown: prev.countdown - 1};
      });
    }, 1000);

    toast.success(`Verification code sent to ${signupValues.email}`);
  } catch (err) {
    toast.error(err.message || "Failed to send OTP. Please try again.");
  }
};

// Resend OTP
const resendOtp = () => {
  generateAndSendOtp();
};

  return (
    <div className={classes.container}>
      <input type="checkbox" id={classes.flip} />
      <div className={classes.cover}>
        <div className={classes.front}>
          <img src="logo.jpg" alt="" />
        </div>
      </div>
      <form name="login" onSubmit={handleSubmit}>
        <div className={classes["form-content"]}>
          <div className={classes["login-form"]}>
            <div className={classes.title}>Login</div>
            <div className={classes["input-boxes"]}>
              <div className={classes["input-box"]}>
                <i className={`fas fa-envelope`}></i>
                <input
                  type="text"
                  placeholder="Enter you email"
                  onBlur={() => {
                    handleInputBlur("login", "email");
                  }}
                  onChange={(event) => {
                    handleInputChange("login", "email", event.target.value);
                  }}
                  value={loginValues.email}
                />
              </div>
              {emailLoginIsInvalid && (
                <div className={classes["control-error"]}>
                  <p>Please enter valid email address</p>
                </div>
              )}
              <div className={classes["input-box"]}>
                <i className={`fas fa-lock`}></i>
                <input
                  type={loginValues.pwd_show ? "password" : "text"}
                  placeholder="Enter you password"
                  onChange={(event) => {
                    handleInputChange("login", "password", event.target.value);
                  }}
                  value={loginValues.password}
                />

                <a
                  href="#"
                  onClick={() => {
                    handleShowPassword("login", "pwd_show");
                  }}
                >
                  <span
                    className={
                      loginValues.pwd_show ? `fas fa-eye` : `fas fa-eye-slash`
                    }
                  />
                </a>
              </div>

              <div className={`${classes.button} ${classes["input-box"]}`}>
                <input type="submit" name="login" value="Login" />
              </div>
              <div className={`${classes.text} ${classes["login-text"]}`}>
                Don't have an account?{" "}
                <label
                  htmlFor={classes.flip}
                  onClick={() => {
                    resetForm("signup");
                  }}
                >
                  Signup now
                </label>
              </div>
            </div>
          </div>
          <div className={classes["signup-form"]}>
            <div className={classes.title}>Signup</div>
            <div className={classes["input-boxes"]}>
              <div className={classes["input-box"]}>
                <i className="fas fa-user"></i>
                {/* <input type="text" placeholder="Enter you name"  /> */}
                <input
                  type="text"
                  placeholder="Enter you name"
                  onBlur={() => {
                    handleInputBlur("signup", "name");
                  }}
                  onChange={(event) => {
                    handleInputChange("signup", "name", event.target.value);
                  }}
                  value={signupValues.name}
                />
              </div>
              {nameSignupIsInvalid && (
                <div className={classes["control-error"]}>
                  <p>Please enter valid name(text only)</p>
                </div>
              )}

              {/* <div className={classes["input-box"]}>
                <i className="fas fa-envelope"></i>
                {/* <input type="text" placeholder="Enter you email"  /> }
                <input
                  type="text"
                  placeholder="Enter you email"
                  onBlur={() => {
                    handleInputBlur("signup", "email");
                  }}
                  onChange={(event) => {
                    handleInputChange("signup", "email", event.target.value);
                  }}
                  value={signupValues.email}
                />
              </div> */}

              <div className={classes["input-box"]}>
              <i className={`fas fa-envelope`}></i>
              <input
                type="text"
                placeholder="Enter your email"
                onBlur={() => handleInputBlur("signup", "email")}
                onChange={(event) => handleInputChange("signup", "email", event.target.value)}
                value={signupValues.email}
                disabled={otpState.isOtpSent}
              />
              </div>

              {emailSignupIsInvalid && (
                <div className={classes["control-error"]}>
                  <p>Please enter valid email address</p>
                </div>
              )}
              <div className={classes["input-box"]}>
                <i className="fas fa-lock"></i>
                {/* <input type="password" placeholder="Enter you password"  /> */}
                <input
                  type={signupValues.pwd_show ? "password" : "text"}
                  placeholder="Enter you password"
                  onChange={(event) => {
                    handleInputChange("signup", "password", event.target.value);
                  }}
                  value={signupValues.password}
                />
                <a
                  href="#"
                  onClick={() => {
                    handleShowPassword("signup", "pwd_show");
                  }}
                >
                  <span
                    className={
                      signupValues.pwd_show ? `fas fa-eye` : `fas fa-eye-slash`
                    }
                  />
                </a>
              </div>
              <div className={classes["input-box"]}>
                <i className="fa fa-lock"></i>
                {/* <input type="password" placeholder="Re-enter you password"  /> */}
                <input
                  type={signupValues.conf_pwd_show ? "password" : "text"}
                  placeholder="Re-enter you password"
                  onChange={(event) => {
                    handleInputChange(
                      "signup",
                      "confirm_password",
                      event.target.value
                    );
                  }}
                  value={signupValues.confirm_password}
                />
                <a
                  href="#"
                  onClick={() => {
                    handleShowPassword("signup", "conf_pwd_show");
                  }}
                >
                  <span
                    className={
                      signupValues.conf_pwd_show
                        ? `fas fa-eye`
                        : `fas fa-eye-slash`
                    }
                  />
                </a>
              </div>
              {pwdNotEqual && (
                <div className={classes["control-error"]}>
                  <p>Passwords must match</p>
                </div>
              )}

        <div className={classes["otp-container"]}>
          <div className={classes["otp-input-group"]}>
            <div className={classes["input-box"]}>
              <i className={`fas fa-key`}></i>
              <input
                type="text"
                placeholder="Enter code"
                onChange={(e) => setOtpState(prev => ({...prev, otp: e.target.value}))}
                value={otpState.otp}
                maxLength="6"
                className={classes["otp-input"]}
              />
            </div>
            {!otpState.isOtpSent ? (
              <button
                type="button"
                onClick={generateAndSendOtp}
                className={classes["otp-button"]}
                disabled={!signupValues.email.includes("@")}
              >
                Send Code
              </button>
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                className={classes["otp-button"]}
                disabled={otpState.countdown > 0}
              >
                {otpState.countdown > 0 ? `Resend (${otpState.countdown}s)` : "Resend"}
              </button>
            )}
          </div>
        </div>

              <div className={`${classes.button} ${classes["input-box"]}`}>
                <input type="submit" name="signup" value="Signup" />
              </div>
              <div className={`${classes.text} ${classes["sign-up-text"]}`}>
                Already have an account?{" "}
                <label
                  htmlFor={classes.flip}
                  onClick={() => {
                    resetForm("login");
                  }}
                >
                  Login now
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
