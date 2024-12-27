import React, { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import styles from './EditProfile.module.css';
import { userInfoActions } from '../../store';

const EditProfile = () => {
  const dispatch = useDispatch();
  // const userInfo = useSelector(state => state.userInfo.user); //fetch
  const userInfo = JSON.parse(localStorage.getItem('userinfo'));
  const userId = userInfo.id;
  // Initial  data
  const initialData = {
    user_name: userInfo.name,
    email_id: userInfo.email,
    password: '',
    retype_password: '',
  };

  // Form state
  const [formData, setFormData] = useState(initialData);
  const [isUserNameEnabled, setIsUserNameEnabled] = useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);

  // Handle form submission
   const handleSubmit = async (e) => {
    e.preventDefault();

    const submittedData = {};
    if (isUserNameEnabled)
      {
        if(formData.user_name !== null && formData.user_name !== undefined && (formData.user_name).trim() !== '')
          submittedData.user_name = (formData.user_name).trim();
        else
        submittedData.user_name= undefined;
      }
    else
      submittedData.user_name= undefined;

    if (isEmailEnabled)
      {
        if(formData.email_id !== null && formData.email_id !== undefined && (formData.email_id).trim() !== '')
          submittedData.email_id = (formData.email_id).trim();
        else
        submittedData.email_id= undefined;
      } 
    else
      submittedData.email_id= undefined;

    if (isPasswordEnabled) {
      if(formData.password !== null && formData.password !== undefined && (formData.password).trim() !== '')
        submittedData.password = (formData.password).trim();
      else
        submittedData.password= undefined;

      if(formData.retype_password !== null && formData.retype_password !== undefined && (formData.retype_password).trim() !== '')
      {
        if(formData.retype_password !== formData.password)
        {
          toast.error("Passwords don't match. Please re-type!");
          return;
        }  
      }
      else{
        toast.error("Please re-type new password!");
        return;
      }
    }
    else
      submittedData.password= undefined;
    
  console.log('Submitted Data:', submittedData);
  //after submitting, fetch('DB') to patch the data. Update the localStorage and redux toolkit.
  try{
    const response = await fetch(`http://localhost:5000/api/users/updateprofile/${userId}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          user_name : submittedData.user_name,
          email_id : submittedData.email_id, 
          password : submittedData.password
      })
    });
    const responseData = await response.json();
    console.log(responseData);
    if(!responseData.ok && !responseData.user)
    { 
       toast.error(responseData.message);
       return;
    }           
   toast.success(responseData.message);
   dispatch(userInfoActions.setUserInfo({
        user: responseData.user
    }));
    if (responseData.user) {
        localStorage.setItem('userinfo', JSON.stringify(responseData.user));
    }

  }
  catch(err){
    console.log(err);
}

    // Reset to initial state
    setIsUserNameEnabled(false);
    setIsEmailEnabled(false);
    setIsPasswordEnabled(false);
    setFormData(initialData);
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
        <label className={isUserNameEnabled ? styles.enabled : styles.disabled}>User Name:</label>
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          disabled={!isUserNameEnabled}
          onChange={handleChange}
        />
      </div>

      {/* Email Field */}
      <div className={styles.fieldContainer}>
        <input
          type="checkbox"
          checked={isEmailEnabled}
          onChange={(e) => setIsEmailEnabled(e.target.checked)}
        />
        <label className={isEmailEnabled ? styles.enabled : styles.disabled}>Email ID:</label>
        <input
          type="email"
          name="email_id"
          value={formData.email_id}
          disabled={!isEmailEnabled}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fieldContainer}>
        <input
          type="checkbox"
          checked={isPasswordEnabled}
          onChange={(e) => setIsPasswordEnabled(e.target.checked)}
        />
        <label className={isPasswordEnabled ? styles.enabled : styles.disabled}>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          disabled={!isPasswordEnabled}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fieldContainer}>
      <label className={isPasswordEnabled ? styles.enabled : styles.disabled}>Re-type Password:</label>
        <input
          type="password"
          name="retype_password"
          value={formData.retype_password}
          disabled={!isPasswordEnabled}
          onChange={handleChange}
        />
      </div>

      {/* Submit Button */}
      <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default EditProfile;
