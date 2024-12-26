const HttpError = require('../models/http-error');
const Wishlist = require('../models/wishlist');


const getWishlistbyUserid = async (req, res, next) => {
    const userId = req.params.uid;

    let wishlist;
    try {
        wishlist = await Wishlist.findOne({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching wishlist failed, please try again later.', 500);
        return next(error);
    }

    if (!wishlist) {
        return next(new HttpError('Could not find a wishlist for the provided user ID.', 404));
    }

    res.status(200).json({ wishlist });
};


const addItem = async (req, res, next) => {
    const userId = req.params.uid;
    const { id, type, title, price } = req.body;

    const newItem = {
        id,
        type,
        title,
        price
    };

    let wishlist;
    try {
        wishlist = await Wishlist.findOne({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching wishlist failed, please try again later.', 500);
        return next(error);
    }

    if (!wishlist) {
        const error = new HttpError('Could not find a wishlist for the provided user ID.', 404);
        return next(error);
    }

    wishlist.movie_tv.push(newItem);

    try {
        await wishlist.save();
    } catch (err) {
        const error = new HttpError('Adding item to wishlist failed, please try again.', 500);
        return next(error);
    }
    res.status(201).json({ message: 'Item added successfully!', wishlist });
};


const removeItem = async (req, res, next) => {
    const userId = req.params.uid;
    const itemId = req.params.itemId;

    let wishlist;
    try {
        wishlist = await Wishlist.findOne({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching wishlist failed, please try again later.', 500);
        return next(error);
    }
    if (!wishlist) {
        return next(new HttpError('Could not find a wishlist for the provided user ID.', 404));
    }

    const itemIndex = wishlist.movie_tv.findIndex(item => item.id === +itemId);
    if (itemIndex === -1) {
        return next(new HttpError('Could not find the item with the provided ID.', 404));
    }

    const removedItem = wishlist.movie_tv.splice(itemIndex, 1);

    try {
        await wishlist.save();
    } catch (err) {
        const error = new HttpError('Removing item from wishlist failed, please try again.', 500);
        return next(error);
    }
    res.status(200).json({
        message: 'Item removed successfully',
        removedItem: removedItem[0]
    });
};


const getWishlistSize = async (req, res, next) => {
    const userId = req.params.uid;

    let wishlist;
    try {
        wishlist = await Wishlist.findOne({ user_id: userId });
    } catch (err) {
        const error = new HttpError('Fetching wishlist failed, please try again later.', 500);
        return next(error);
    }

    if (!wishlist) {
        return next(new HttpError('Could not find a wishlist for the provided user ID.', 404));
    }

    const wishlistSize = wishlist.movie_tv.length;

    res.status(200).json({
        userId: userId,
        wishlistSize: wishlistSize
    });
};

const createWishlist = async (userId) => {
    
    let existingWishlist;
    try {
        existingWishlist = await Wishlist.findOne({ user_id: userId });
    } catch (err) {
        throw new Error('Checking for existing wishlist failed.');
    }
    
    if (existingWishlist) {
        throw new Error('Wishlist already exists for this user.');
    }
    
    const newWishlist = new Wishlist({
        //wishlist_id: new mongoose.Types.ObjectId(), 
        user_id: userId,
        movie_tv: [] 
    });
    
    try {
        await newWishlist.save();
    } catch (err) {
        throw new Error('Creating the wishlist failed.');
    }
    
    return newWishlist;
};


exports.getWishlistbyUserid = getWishlistbyUserid;
exports.addItem = addItem;
exports.removeItem = removeItem;
exports.getWishlistSize= getWishlistSize;
exports.createWishlist= createWishlist;