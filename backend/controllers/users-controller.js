const HttpError = require('../models/http-error');
const bcrypt= require('bcrypt');
const User = require('../models/user');
const { createWishlist } = require('./wishlist-controller');
const { createCart } = require('./cart-controller');


const signup = async (req, res, next) => {
    const { user_id, user_name, email_id, password } = req.body;
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

    res.status(201).json({ user: createdUser });
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
    res.status(200).json({ message: 'Logged in successfully!', user: { id: identifiedUser.user_id, email: identifiedUser.email_id } });
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
    res.status(200).json({
        message: 'Profile updated successfully!',
        user: {
            user_id: identifiedUser.user_id,
            user_name: identifiedUser.user_name,
            email_id: identifiedUser.email_id,
        }
    });

};

exports.signup = signup;
exports.login= login;
exports.updateProfile= updateProfile;