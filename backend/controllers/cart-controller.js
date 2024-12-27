const HttpError = require('../models/http-error');
const Cart = require('../models/cart');


const getCartbyUserid = async(req,res,next) => {
    const userId = req.params.uid;

    let cart;
    try {
        cart = await Cart.findOne({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching cart failed, please try again later.', 500);
        return next(error);
    }

    if (!cart) {
        return next(new HttpError('Could not find a cart for the provided user ID.', 404));
    }

    res.status(200).json({ cart });
};

const addItem = async(req,res,next)=>{
    const userId = req.params.uid;
    const { id, type, title, price } = req.body;

    const newItem = {
        id,
        type,
        title,
        price
    };

    let cart;
    try {
        cart = await Cart.findOne({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching cart failed, please try again later.', 500);
        return next(error);
    }

    if (!cart) {
        const error = new HttpError('Could not find a cart for the provided user ID.', 404);
        return next(error);
    }

    cart.movie_tv.push(newItem);

    try {
        await cart.save();
    } catch (err) {
        const error = new HttpError('Adding item to cart failed, please try again.', 500);
        return next(error);
    }
    res.status(201).json({ message: 'Added to Cart successfully!', cart });

};

const removeItem = async(req, res, next) => {
    const userId = req.params.uid;
    const itemId = req.params.itemId;

    let cart;
    try {
        cart = await Cart.findOne({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching cart failed, please try again later.', 500);
        return next(error);
    }
    if (!cart) {
        return next(new HttpError('Could not find a cart for the provided user ID.', 404));
    }

    const itemIndex = cart.movie_tv.findIndex(item => item.id === +itemId);
    if (itemIndex === -1) {
        return next(new HttpError('Could not find the item with the provided ID.', 404));
    }

    const removedItem = cart.movie_tv.splice(itemIndex, 1);

    try {
        await cart.save();
    } catch (err) {
        const error = new HttpError('Removing item from cart failed, please try again.', 500);
        return next(error);
    }
    res.status(200).json({
        message: 'Removed from Cart successfully!',
        removedItem: removedItem[0]
    });

};

const getCartSize = async(req, res, next) => {
    const userId = req.params.uid;

    let cart;
    try {
        cart = await Cart.findOne({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching cart failed, please try again later.', 500);
        return next(error);
    }

    if (!cart) {
        return next(new HttpError('Could not find a cart for the provided user ID.', 404));
    }

    const cartSize = cart.movie_tv.length;

    res.status(200).json({
        userId: userId,
        cartSize: cartSize
    });
};

const createCart = async (userId) => {
    
    let existingCart;
    try {
        existingCart = await Cart.findOne({ user_id: userId });
    } catch (err) {
        throw new Error('Checking for existing cart failed.');
    }
    
    if (existingCart) {
        throw new Error('Cart already exists for this user.');
    }
    
    const newCart = new Cart({
        user_id: userId,
        movie_tv: [] 
    });
    
    try {
        await newCart.save();
    } catch (err) {
        throw new Error('Creating the cart failed.');
    }
    
    return newCart;
};

exports.getCartbyUserid = getCartbyUserid;
exports.addItem = addItem;
exports.removeItem = removeItem;
exports.getCartSize= getCartSize;
exports.createCart= createCart;