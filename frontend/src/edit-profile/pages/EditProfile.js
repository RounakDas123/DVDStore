import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { userInfoActions } from "../../store";
import styles from "./EditProfile.module.css";

const EditProfile = () => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userinfo"))
  );

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters
    if (password.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters long" };
    }
    // At least one letter
    if (!/[a-zA-Z]/.test(password)) {
      return { valid: false, message: "Password must contain at least one letter" };
    }
    // At least one number
    if (!/\d/.test(password)) {
      return { valid: false, message: "Password must contain at least one number" };
    }
    // At least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: "Password must contain at least one special character" };
    }
    return { valid: true };
  };

  const initialData = {
    user_name: userInfo?.name || "",
    email_id: userInfo?.email || "",
    password: "",
    retype_password: "",
  };
  const userId = userInfo.id;
  useEffect(() => {
    // Sync form data with updated userInfo
    setFormData({
      user_name: userInfo?.name || "",
      email_id: userInfo?.email || "",
      password: "",
      retype_password: "",
    });
  }, [userInfo]);

  // Form state
  const [formData, setFormData] = useState(initialData);
  const [isUserNameEnabled, setIsUserNameEnabled] = useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);

  // Check if any field is enabled
  const isAnyFieldEnabled = isUserNameEnabled || isEmailEnabled || isPasswordEnabled;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields if they are enabled
    if (isUserNameEnabled && (!formData.user_name || formData.user_name.trim() === "")) {
      toast.error("User name cannot be blank");
      return;
    }

    if (isEmailEnabled) {
      if (!formData.email_id || formData.email_id.trim() === "") {
        toast.error("Email cannot be blank");
        return;
      }
      if (!validateEmail(formData.email_id.trim())) {
        toast.error("Please enter a valid email address");
        return;
      }
    }
    
    if (isPasswordEnabled) {
      if (!formData.password || formData.password.trim() === "") {
        toast.error("Password cannot be blank");
        return;
      }

      // Validate password complexity
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        toast.error(passwordValidation.message);
        return;
      }

      if (formData.retype_password !== formData.password) {
        toast.error("Passwords don't match. Please re-type!");
        return;
      }
    }

    const submittedData = {
      email_id: isEmailEnabled 
        ? formData.email_id.trim() 
        : userInfo.email,
      user_name: isEmailEnabled 
        ? formData.user_name.trim() 
        : userInfo.name
    };

    // Add user_name if enabled and not blank
    // if (isUserNameEnabled) {
    //   submittedData.user_name = formData.user_name.trim();
    // }

    // Add password if enabled and not blank
    if (isPasswordEnabled) {
      submittedData.password = formData.password.trim();
    }

    // Send data to backend
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/updateprofile/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submittedData),
        }
      );
      const responseData = await response.json();

      if (!response.ok || !responseData.user) {
        toast.error(responseData.message);
        return;
      }
      
      toast.success(responseData.message);
      dispatch(
        userInfoActions.setUserInfo({
          user: responseData.user,
        })
      );
      
      if (responseData.user) {
        localStorage.setItem("userinfo", JSON.stringify(responseData.user));
      }
      setUserInfo(responseData.user);
      setFormData({
        user_name: responseData.user.name || "",
        email_id: responseData.user.email || "",
        password: "",
        retype_password: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while updating profile");
    }

    // Reset to initial state
    setIsUserNameEnabled(false);
    setIsEmailEnabled(false);
    setIsPasswordEnabled(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={styles.editcontainer}>
      <form onSubmit={handleSubmit}>
        {/* User Name Field */}
        <div className={styles.fieldContainer}>
          <input
            type="checkbox"
            checked={isUserNameEnabled}
            onChange={(e) => setIsUserNameEnabled(e.target.checked)}
          />
          <label
            className={isUserNameEnabled ? styles.enabled : styles.disabled}
          >
            User Name:
          </label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            disabled={!isUserNameEnabled}
            onChange={handleChange}
            required={isUserNameEnabled}
          />
        </div>

        {/* Email Field */}
        <div className={styles.fieldContainer}>
          <input
            type="checkbox"
            checked={isEmailEnabled}
            onChange={(e) => setIsEmailEnabled(e.target.checked)}
          />
          <label className={isEmailEnabled ? styles.enabled : styles.disabled}>
            Email ID:
          </label>
          <input
            type="email"
            name="email_id"
            value={formData.email_id}
            disabled={!isEmailEnabled}
            onChange={handleChange}
            required={isEmailEnabled}
          />
        </div>

        <div className={styles.fieldContainer}>
          <input
            type="checkbox"
            checked={isPasswordEnabled}
            onChange={(e) => setIsPasswordEnabled(e.target.checked)}
          />
          <label
            className={isPasswordEnabled ? styles.enabled : styles.disabled}
          >
            New Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            disabled={!isPasswordEnabled}
            onChange={handleChange}
            required={isPasswordEnabled}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label
            className={isPasswordEnabled ? styles.enabled : styles.disabled}
          >
            Re-type Password:
          </label>
          <input
            type="password"
            name="retype_password"
            value={formData.retype_password}
            disabled={!isPasswordEnabled}
            onChange={handleChange}
            required={isPasswordEnabled}
          />
        </div>

        {isPasswordEnabled && (
          <div className={styles.passwordRequirements}>
            <p>Password must:</p>
            <ul>
              <li className={formData.password.length >= 8 ? styles.valid : styles.invalid}>
                Be at least 8 characters long
              </li>
              <li className={/[a-zA-Z]/.test(formData.password) ? styles.valid : styles.invalid}>
                Contain at least one letter
              </li>
              <li className={/\d/.test(formData.password) ? styles.valid : styles.invalid}>
                Contain at least one number
              </li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? styles.valid : styles.invalid}>
                Contain at least one special character
              </li>
            </ul>
          </div>
        )}

        <button 
          type="submit" 
          disabled={!isAnyFieldEnabled}
          className={!isAnyFieldEnabled ? styles.disabledButton : ""}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditProfile;