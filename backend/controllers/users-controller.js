const HttpError = require('../models/http-error');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { createWishlist } = require('./wishlist-controller');
const { createCart } = require('./cart-controller');
const { createEmptyTransaction } = require('./transaction-controller');
const { sendEmail } = require('./emailService');


const signup = async (req, res, next) => {
    const {  user_name, email_id, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email_id: email_id });
    } catch (err) {
        return next(new HttpError('Signup failed, please try again later.', 500));
    }

    if (existingUser) {
        return next(new HttpError('Could not create user, email already exists.', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new HttpError('Could not create user, please try again later.', 500));
    }

    let user_id;
    try {
        const maxUser = await User.findOne().sort({ user_id: -1 }).select('user_id');
        user_id = maxUser ? maxUser.user_id + 1 : 1;
    } catch (err) {
        return next(new HttpError('Signup failed, unable to assign user ID.', 500));
    }

    const createdUser = new User({
        user_id,
        user_name,
        email_id,
        password: hashedPassword
    });

    try {
        await createdUser.save();
    } catch (err) {
        return next(new HttpError('Signup failed, please try again.', 500));
    }

    try {
        await createWishlist(createdUser.user_id); // Create wishlist for the user
    } catch (err) {
        return next(new HttpError('Failed to create wishlist for the user, please try again later.', 500));
    }

    try {
        await createCart(createdUser.user_id); // Create cart for the user
    } catch (err) {
        return next(new HttpError('Failed to create cart for the user, please try again later.', 500));
    }

    try {
        await createEmptyTransaction(createdUser.user_id); // Create empty transaction list for the user
    } catch (err) {
        return next(new HttpError('Failed to create empty transactions for the user, please try again later.', 500));
    }

    await sendEmail(email_id, 'WELCOME', user_name );

    let token;
    try{
        token = jwt.sign({userId: createdUser.user_id, email: createdUser.email_id}, 
        'key_das_rounak_secret', 
        {expiresIn: '1h'}
    );
    }catch(err){
        return next(new HttpError('Signup failed, please try again.', 500));
    }
    

    res.status(201).json({ message:"You have successfully signed up!",user: createdUser, token:token });
};


const login = async (req, res, next) => {
    const { email_id, password } = req.body;
    let identifiedUser;
    try {
        identifiedUser = await User.findOne({ email_id: email_id });
    } catch (err) {
        const error = new HttpError('Login failed, please try again later.', 500);
        return next(error);
    }

    if (!identifiedUser) {
        const error = new HttpError('Could not find user with the provided email.', 401);
        return next(error);
    }
    let isPasswordValid = false;
    try {
        isPasswordValid = await bcrypt.compare(password, identifiedUser.password);
    } catch (err) {
        const error = new HttpError('Could not log in, please check your credentials and try again.', 500);
        return next(error);
    }
    if (!isPasswordValid) {
        const error = new HttpError('Invalid credentials, could not log you in.', 401);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign({userId: identifiedUser.user_id, email: identifiedUser.email_id}, 
        'key_das_rounak_secret', 
        {expiresIn: '1h'}
    );
    }catch(err){
        return next(new HttpError('Signup failed, please try again.', 500));
    }

    res.status(200).json({ message: 'You have logged in successfully!', user: { id: identifiedUser.user_id, name:identifiedUser.user_name ,email: identifiedUser.email_id }, token:token });
};

const updateProfile = async (req, res, next) => {
    const { user_name, email_id, password } = req.body;
    const user_id = req.params.uid;
    let identifiedUser;
    try {
        identifiedUser = await User.findOne({ user_id: user_id });
    } catch (err) {
        const error = new HttpError('Updating profile failed, please try again later.', 500);
        return next(error);
    }
    if (!identifiedUser) {
        const error = new HttpError('Could not find user with the provided ID.', 404);
        return next(error);
    }
    if (user_name !== undefined) {
        identifiedUser.user_name = user_name;
    }
    if (email_id !== undefined) {
        identifiedUser.email_id = email_id;
    }
    if (password !== undefined) {
        try {
            identifiedUser.password = await bcrypt.hash(password, 12); // Hash the new password
        } catch (err) {
            const error = new HttpError('Could not update password, please try again later.', 500);
            return next(error);
        }
    }
    try {
        await identifiedUser.save();
    } catch (err) {
        const error = new HttpError('Updating profile failed, please try again.', 500);
        return next(error);
    }
    //sending email after successful update
    await sendEmail(email_id, 'PROFILE_UPDATE', identifiedUser );


    res.status(200).json({
        message: 'Profile updated successfully!',
        user: {
            id: identifiedUser.user_id,
            name: identifiedUser.user_name,
            email: identifiedUser.email_id,
        }
    });

};

exports.signup = signup;
exports.login= login;
exports.updateProfile= updateProfile;