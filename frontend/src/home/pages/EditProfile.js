import React, { useState } from 'react';
import styles from './EditProfile.module.css';

const EditProfile = () => {
  // Initial dummy data
  const initialData = {
    user_name: 'JohnDoe',
    email_id: 'john@example.com',
    password: '',
    retype_password: '',
  };

  // Form state
  const [formData, setFormData] = useState(initialData);
  const [isUserNameEnabled, setIsUserNameEnabled] = useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const submittedData = {};
    if (isUserNameEnabled) submittedData.user_name = formData.user_name;
    if (isEmailEnabled) submittedData.email_id = formData.email_id;
    if (isPasswordEnabled) {
      submittedData.password = formData.password;
      submittedData.retype_password = formData.retype_password;
    }

    console.log('Submitted Data:', submittedData);

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
