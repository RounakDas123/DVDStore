const HttpError = require('../models/http-error');
const Transaction = require('../models/transaction'); 
const { clearCartByUserId } = require('./cart-controller');
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
    
    res.status(201).json({ 
        message: 'You have completed checkout successfully.', 
        cart : {...cart}
    });
};

exports.createEmptyTransaction = createEmptyTransaction;
exports.addTransaction = addTransaction;