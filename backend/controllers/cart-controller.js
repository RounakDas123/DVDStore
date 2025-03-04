const HttpError = require('../models/http-error');
const Cart = require('../models/cart');


const getCartbyUserid = async(req,res,next) => {
    const userId = req.params.uid;

    let cart;
    try {
        cart = await Cart.findOne({ user_id: userId }, { _id: 0 });
    } catch (err) {
        const error = new HttpError('Fetching cart failed, please try again later.', 500);
        return next(error);
    }

    if (!cart) {
        return next(new HttpError('Could not find a cart for the provided user ID.', 404));
    }

    res.status(200).json({ cart });
};

const clearCartByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    try {
        const result = await Cart.updateOne(
            { user_id: userId },
            { $set: { movie_tv: [] } } // Set movie_tv to an empty array
        );

        if (result.matchedCount === 0) {
            return next(new HttpError('Could not find a cart for the provided user ID.', 404));
        }

        res.status(200).json({ message: 'You have completed checkout successfully.', cart: {
            user_id: userId,
            movie_tv: []
        } });
    } catch (err) {
        const error = new HttpError('Clearing cart failed, please try again later.', 500);
        return next(error);
    }
};

const updateQuantity = async (req, res, next) => {
    const userId = req.params.uid;
    const id = req.params.movieId;
    const { identifier } = req.body; // `identifier` is either 'increase' or 'decrease'

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

    // Find the item in the cart
    const item = cart.movie_tv.find((movie) => movie.id === Number(id));

    if (!item) {
        const error = new HttpError('Item not found in the cart.', 404);
        return next(error);
    }

    // Update the quantity based on identifier
    if (identifier === 'increase') {
        item.quantity += 1;
    } else if (identifier === 'decrease') {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // Optionally remove the item if the quantity becomes 0
            cart.movie_tv = cart.movie_tv.filter((movie) => movie.id !== Number(id));
        }
    } else {
        const error = new HttpError('Invalid identifier. Use "increase" or "decrease".', 400);
        return next(error);
    }

    try {
        await cart.save();
    } catch (err) {
        const error = new HttpError('Updating item quantity failed, please try again.', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Quantity updated successfully!', cart: cart });
};

const addItem = async(req,res,next)=>{
    const userId = req.params.uid;
    const { id, type, title, price, quantity } = req.body;

    const newItem = {
        id,
        type,
        title,
        price,
        quantity
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
    res.status(201).json({ message: 'Added to Cart successfully!', cart:cart });

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
        cart:cart,
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

    // const cartSize = cart.movie_tv.length;
    const cartSize = cart.movie_tv.reduce((sum, item) => sum + item.quantity, 0);

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
exports.clearCartByUserId= clearCartByUserId;
exports.updateQuantity= updateQuantity;