const HttpError = require('../models/http-error');
const Transaction = require('../models/transaction'); 
const { clearCartByUserId } = require('./cart-controller');
const { sendEmail } = require('./emailService');
const User = require('../models/user');
const Cart = require('../models/cart');

const createEmptyTransaction = async (userId) => {
    let existingTransaction;
    try {
        existingTransaction = await Transaction.findOne({ user_id: userId });
    } catch (err) {
        throw new Error('Checking for existing transactions failed.');
    }
    
    if (existingTransaction) {
        throw new Error('Transaction document already exists for this user.');
    }
    
    const newTransaction = new Transaction({
        user_id: userId,
        trans: [] 
    });
    
    try {
        await newTransaction.save();
    } catch (err) {
        throw new Error('Creating the transaction document failed.');
    }
    
    return newTransaction;
};

const getCartbyUserid = async(userId) => {
    let cart;
    try {
        cart = await Cart.findOne({ user_id: userId }, { _id: 0 });
    } catch (err) {
        // const error = new HttpError('Fetching cart failed, please try again later.', 500);
        // return next(error);
        throw new Error('Fetching cart failed, please try again later.');
    }

    if (!cart) {
        // return next(new HttpError('Could not find a cart for the provided user ID.', 404));
        throw new Error('Could not find a cart for the provided user ID.');
    }
    
    return cart;
};

const addTransaction = async (req, res, next) => {
    const userId = req.params.uid;
    const cart_res = await getCartbyUserid(userId);

    let movie_tv  = cart_res.movie_tv; 

    if (!movie_tv || movie_tv.length === 0) {
        const error = new HttpError('No items provided for the transaction.', 400);
        return next(error);
    }

    movie_tv = movie_tv.map(item => {
        const { _id, ...itemWithoutId } = item; // Destructure to remove _id
        return itemWithoutId;
    });

    let userTransactions;
    try {
        userTransactions = await Transaction.findOne({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching transactions failed, please try again later.', 500);
        return next(error);
    }

    // If no transaction document exists, create one first
    if (!userTransactions) {
        try {
            userTransactions = await createEmptyTransaction(userId);
        } catch (err) {
            const error = new HttpError('Creating transaction document failed.', 500);
            return next(error);
        }
    }

    // Calculate the next transaction ID
    const nextTransId = userTransactions.trans.length > 0 
        ? Math.max(...userTransactions.trans.map(t => t.trans_id)) + 1 
        : 1;

    const newTransaction = {
        trans_id: nextTransId,
        movie_tv: movie_tv,
        date: new Date() 
    };

    userTransactions.trans.push(newTransaction);

    try {
        await userTransactions.save();
    } catch (err) {
        const error = new HttpError('Adding transaction failed, please try again.', 500);
        return next(error);
    }

    const cart = await clearCartByUserId(req,res,next);
    movie_tv = movie_tv.map(item => {
        // Use item._doc to get the actual data, or fall back to item if _doc doesn't exist
        const itemData = item._doc || item;
        const { _id, __v, ...cleanItem } = itemData; // Remove Mongoose-specific fields
        return cleanItem;
    });

    const orderDetails = {
        orderId: nextTransId,
        amount: movie_tv.reduce((total, item) => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;
            return total + (price * quantity);
        }, 0),
        items: movie_tv.map(item => {
            const title = item.title || 'Unknown Item';
            const type = item.type === 'movie' ? 'Movie' : 'TV Show';
            const quantity = item.quantity || 0;
            const price = item.price || 0;
            // Include individual price with ₹ symbol
            return `${title} (${type}) - ₹${price} x ${quantity}`;
        }),
        formattedAmount: `₹${movie_tv.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0)}`
    };

    const user = await User.findOne({ user_id: Number(userId) }); 
    if (!user) {
        const error = new HttpError('User not found.', 404);
        return next(error);
    }
    const userEmail = user.email_id;

    try {
        await sendEmail(userEmail,'CHECKOUT',orderDetails);
    } catch (err) {
        console.error('Failed to send confirmation email:', err);
    }
    
    res.status(201).json({ 
        message: 'You have completed checkout successfully.', 
        cart : {...cart}
    });
};

const getTransactionsByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    if (req.userData.userId !== parseInt(userId)) {
        const error = new HttpError('Unauthorized access to transactions.', 403);
        return next(error);
    }

    try {
        const transactions = await Transaction.findOne({ user_id: userId });
        
        if (!transactions) {
            return res.status(200).json({ trans: [] });
        }
        
        res.status(200).json(transactions);
    } catch (err) {
        const error = new HttpError(
            'Fetching transactions failed, please try again later.',
            500
        );
        return next(error);
    }
};

exports.createEmptyTransaction = createEmptyTransaction;
exports.addTransaction = addTransaction;
exports.getTransactionsByUserId = getTransactionsByUserId;