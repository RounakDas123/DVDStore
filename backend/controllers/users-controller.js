const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        user_id : 1,
        user_name: 'Rounak01',
        email_id: 'rrr@gmail.com',
        password: '123abc'
    },
    {
        user_id : 5,
        user_name: 'Rounak05',
        email_id: 'yyy@gmail.com',
        password: '123xyz'     
    }
];

const signup = (req,res,next) =>{
    const {user_id,user_name,email_id,password} = req.body;
    const hasUser= DUMMY_USERS.find(u => u.email_id===email_id);
    if(hasUser)
    {
        throw new HttpError('Could not create user, email already exists', 422);
    }

    const createdUser = {user_id,user_name,email_id,password};
    DUMMY_USERS.push(createdUser);
    res.status(201).json({user:createdUser});
};

const login = (req,res,next) =>{
    const {email_id,password} = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email_id === email_id);
    if(!identifiedUser )
    {
        throw new HttpError('Could not find user.', 401);
    }
    if(identifiedUser.password !== password)
    {
        throw new HttpError('Credentials incorrect', 401);
    }

    res.json({message: 'Logged in!'});
};

const updateProfile = (req,res,next) =>{
    const {user_name,email_id,password} = req.body;
    const user_id = req.params.uid; 
    const identifiedUser = DUMMY_USERS.find(u => u.user_id === +user_id);
    if(!identifiedUser )
    {
        throw new HttpError('Could not find user.', 401);
    }
    if(user_name !== undefined)
    {
        identifiedUser.user_name = user_name;
    }
    if(email_id !== undefined)
    {
        identifiedUser.email_id = email_id;
    }
    if(password !== undefined)
    {
        identifiedUser.password = password;
    }

    console.log(user_id,user_name,email_id,password);
    res.json([{user_id,user_name,email_id,password},identifiedUser]);
};

exports.signup = signup;
exports.login= login;
exports.updateProfile= updateProfile;