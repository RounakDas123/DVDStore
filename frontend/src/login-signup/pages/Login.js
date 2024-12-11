import React from 'react';

import classes from './Login.module.css';

const Login = () => {
    return (
        <div className={classes.container}>
        <input type="checkbox" id={classes.flip} />
        <div className={classes.cover}>
            <div className={classes.front}>
                <img src="logo.jpg" alt="" />
            </div>
            
        </div>
        <form action="#">
            <div className={classes["form-content"]}>
                <div className={classes["login-form"]}>
                    <div className={classes.title}>Login</div>
                    <div className={classes["input-boxes"]}>
                        <div className={classes["input-box"]}>
                            <i className={`fas fa-envelope`}></i>
                            <input type="text" placeholder="Enter you email" required />
                            
                        </div>
                        <div className={classes["input-box"]}>
                            <i className={`fas fa-lock`}></i>
                            <input type="password" placeholder="Enter you password" required />
                            
                        </div>
                        
                        <div className={`${classes.button} ${classes["input-box"]}`}>
                            
                            <input type="submit" value="Login" />
                            
                        </div>
                        <div className={`${classes.text} ${classes["login-text"]}`}>Don't have an account? <label htmlFor={classes.flip}>Signup now</label></div>
                    </div>
                </div>
                <div className={classes["signup-form"]}>
                    <div className={classes.title}>Signup</div>
                    <div className={classes["input-boxes"]}>
                        <div className={classes["input-box"]}>
                            <i className="fas fa-user"></i>
                            <input type="text" placeholder="Enter you name" required />
                            
                        </div>
                        <div className={classes["input-box"]}>
                            <i className="fas fa-envelope"></i>
                            <input type="text" placeholder="Enter you email" required />
                            
                        </div>
                        <div className={classes["input-box"]}>
                            <i className="fas fa-lock"></i>
                            <input type="password" placeholder="Enter you password" required />
                            
                        </div> 
                        <div className={classes["input-box"]}>
                            <i className="fa fa-lock"></i>
                            <input type="password" placeholder="Re-enter you password" required />
                            
                        </div>
                        
                        <div className={`${classes.button} ${classes["input-box"]}`}>
                            
                            <input type="submit" value="Signup" />
                            
                        </div>
                        <div className={`${classes.text} ${classes["sign-up-text"]}`}>Already have an account? <label htmlFor={classes.flip}>Login now</label></div>
                    </div>
                </div>
            </div>

        </form>
    </div>
    );
}

export default Login;