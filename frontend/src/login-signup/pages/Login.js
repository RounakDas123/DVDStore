import React, { useState } from 'react';

import classes from './Login.module.css';

const Login = () => {
const [loginValues, setLoginValues] = useState({    //for updating state of login page inputs
    email : '',
    password : '',
    pwd_show: true
});

const [signupValues, setSignupValues] = useState({  //for updating state of signup page inputs
    name: '',
    email : '',
    password : '',
    confirm_password: '',
    pwd_show: true,
    conf_pwd_show: true
});

const [pwdNotEqual, setPwdNotEqual] = useState(false);

const [didEdit, setDidEdit] = useState({  //used for checking if input is edited, i.e. losing focus or not
    login:{
        email : false
    },
    signup:{
        name: false,
        email : false
    }
});

// const [hidePassword, setHidePassword]= useState(true); 

const emailLoginIsInvalid = didEdit.login.email && !loginValues.email.includes('@'); //for validation login email 
const nameSignupIsInvalid = didEdit.signup.name && !signupValues.name.match(/^[a-zA-Z]+$/); //for validation signup name 
const emailSignupIsInvalid = didEdit.signup.email && !signupValues.email.includes('@'); //for validation signup email 

function handleSubmit(event) // this function is called when submitting the form
{
    event.preventDefault();
    var buttonName = event.nativeEvent.submitter.name;
    if (buttonName === 'login')
    {
        console.log(loginValues);
        setLoginValues({ //for setting all the fields to initial state, i.e, resetting the form after successful submission.
            email : '',
            password : '',
            pwd_show: true
        });
    }
    else if (buttonName === 'signup')
    {
        console.log(signupValues);
        if(signupValues.password !== signupValues.confirm_password)
        {
            setPwdNotEqual(true);
            return;
        }
        setSignupValues({
            name: '',
            email : '',
            password : '',
            confirm_password: '',
            pwd_show: true,
            conf_pwd_show: true
        });
        
    } 
    setDidEdit({  // setting the states for checking edited or not to initial values
        login:{
            email : false
        },
        signup:{
            name: false,
            email : false
        }
    });
}

function handleInputChange(section,identifier, value) //this function is called on every keystroke in input element(onChange event)
{
    if(section === 'login')
    {
        setLoginValues(prevValues => ({
            ...prevValues,
            [identifier]: value
        }));
    }else if(section === 'signup')
    {
        setSignupValues(prevValues => ({
            ...prevValues,
            [identifier]: value
        }));
    }
    
    setDidEdit(prevEdit => ({ // this is done to remove the error message as soon as user starts typing again.
        ...prevEdit,
        [section]:{...prevEdit[section], [identifier]: false}
    }))
}

function handleInputBlur(section,identifier) //this function is called when input element loses focus.(onBlur event) 
{
    setDidEdit(prevEdit => ({ // this is done to show the error message(if any) as soon as input element loses focus.
        ...prevEdit,
        [section]:{...prevEdit[section], [identifier]: true}
    }))
}

function handleShowPassword(section,identifier)//this function is called to show or hide the password 
{   
    if(section === 'login')
    {
        setLoginValues(prevValues => {
            var showpwd = !prevValues.pwd_show; // this is done to reverse the previous state of pwd_show to toggle between true-false
            return({
                ...prevValues,
                [identifier]: showpwd
            });
            
        })
    }
    else if(section === 'signup')
    {
        if(identifier=== 'pwd_show')
        {
            setSignupValues(prevValues => {
                var showpwd = !prevValues.pwd_show;
                return({
                    ...prevValues,
                    [identifier]: showpwd
                })
                
            });
        }
        else if(identifier=== 'conf_pwd_show')
        {
            setSignupValues(prevValues => {
                var showconfpwd = !prevValues.conf_pwd_show;
                return({
                    ...prevValues,
                    [identifier]: showconfpwd
                })
                
            });
        }
    }
    
}

    return (
        <div className={classes.container}>
        <input type="checkbox" id={classes.flip} />
        <div className={classes.cover}>
            <div className={classes.front}>
                <img src="logo.jpg" alt="" />
            </div>
            
        </div>
        <form name="login" onSubmit={handleSubmit} >
            <div className={classes["form-content"]}>
                <div className={classes["login-form"]}>
                    <div className={classes.title}>Login</div>
                    <div className={classes["input-boxes"]}>
                        <div className={classes["input-box"]}>
                            <i className={`fas fa-envelope`}></i>
                            <input 
                            type="text" 
                            placeholder="Enter you email" 
                            onBlur={() => {handleInputBlur('login','email')}}
                            onChange={(event)=>{handleInputChange('login','email',event.target.value)}} 
                            value={loginValues.email} />
                            
                        </div>
                        {
                            emailLoginIsInvalid && (<div className={classes["control-error"]}>
                                <p>Please enter valid email address</p>
                                </div>)
                        }
                        <div className={classes["input-box"]}>
                            <i className={`fas fa-lock`}></i>
                            <input 
                            type={loginValues.pwd_show ? "password" : "text"} 
                            placeholder="Enter you password" 
                            onChange={(event)=>{handleInputChange('login','password',event.target.value)}} 
                            value={loginValues.password} />
                            
                            <a 
                            href='#'
                            onClick={()=>{handleShowPassword('login','pwd_show')}}
                            >
                                <span
                                className={loginValues.pwd_show ? `fas fa-eye` : `fas fa-eye-slash`}
                                />
                            </a>
                        </div>
                        
                        <div className={`${classes.button} ${classes["input-box"]}`}>
                            
                            <input type="submit" name="login" value="Login"/>
                            
                        </div>
                        <div className={`${classes.text} ${classes["login-text"]}`}>Don't have an account? <label htmlFor={classes.flip}>Signup now</label></div>
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
                            onBlur={() => {handleInputBlur('signup','name')}}
                            onChange={(event)=>{handleInputChange('signup','name',event.target.value)}} 
                            value={signupValues.name} />
                        </div>
                        {
                            nameSignupIsInvalid && (<div className={classes["control-error"]}>
                                <p>Please enter valid name</p>
                                </div>)
                        }
                        <div className={classes["input-box"]}>
                            <i className="fas fa-envelope"></i>
                            {/* <input type="text" placeholder="Enter you email"  /> */}
                            <input 
                            type="text" 
                            placeholder="Enter you email" 
                            onBlur={() => {handleInputBlur('signup','email')}}
                            onChange={(event)=>{handleInputChange('signup','email',event.target.value)}} 
                            value={signupValues.email} />
                            
                        </div>
                        {
                            emailSignupIsInvalid && (<div className={classes["control-error"]}>
                                <p>Please enter valid email address</p>
                                </div>)
                        }
                        <div className={classes["input-box"]}>
                            <i className="fas fa-lock"></i>
                            {/* <input type="password" placeholder="Enter you password"  /> */}
                            <input 
                            type={signupValues.pwd_show ? "password" : "text"} 
                            placeholder="Enter you password" 
                            onChange={(event)=>{handleInputChange('signup','password',event.target.value)}} 
                            value={signupValues.password} />
                            <a 
                            href='#'
                            onClick={()=>{handleShowPassword('signup','pwd_show')}}
                            >
                                <span
                                className={signupValues.pwd_show ? `fas fa-eye` : `fas fa-eye-slash`}
                                />
                            </a>

                        </div> 
                        <div className={classes["input-box"]}>
                            <i className="fa fa-lock"></i>
                            {/* <input type="password" placeholder="Re-enter you password"  /> */}
                            <input 
                            type={signupValues.conf_pwd_show ? "password" : "text"} 
                            placeholder="Re-enter you password" 
                            onChange={(event)=>{handleInputChange('signup','confirm_password',event.target.value)}} 
                            value={signupValues.confirm_password} />
                            <a 
                            href='#'
                            onClick={()=>{handleShowPassword('signup','conf_pwd_show')}}
                            >
                                <span
                                className={signupValues.conf_pwd_show ? `fas fa-eye` : `fas fa-eye-slash`}
                                />
                            </a>
                        </div>
                        {
                            pwdNotEqual && (<div className={classes["control-error"]}>
                                <p>Passwords must match</p>
                                </div>)
                        }
                        
                        <div className={`${classes.button} ${classes["input-box"]}`}>
                            
                            <input type="submit" name="signup" value="Signup" />
                            
                        </div>
                        <div className={`${classes.text} ${classes["sign-up-text"]}`}>Already have an account? <label htmlFor={classes.flip}>Login now</label></div>
                    </div>
                </div>
            </div>

        </form>
    </div>
    );
}

export default Login ;