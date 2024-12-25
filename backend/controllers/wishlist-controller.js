const HttpError = require('../models/http-error');

const DUMMY_WISH = [
    {
        wishlist_id : 1,
        user_id : 1,
        movie_tv : [{
            id: 121212,
            type: 'movie',
            title: 'Venom',
            price: 100
        },
        {
            id: 565656,
            type: 'tv',
            title: 'Dexter',
            price: 200
        }]
    },
    {
        wishlist_id : 2,
        user_id : 5,
        movie_tv : [{
            id: 589589,
            type: 'movie',
            title: 'Avengers',
            price: 150
        }]       
    }
];

const getWishlistbyUserid = (req,res,next) => {
    const userId = req.params.uid;
    const wishList = DUMMY_WISH.find(w => {
        return w.user_id === +userId;
    });

    if(!wishList)
    {
        return next(new HttpError('Could not find user by the provided id',404));
    }

    res.json({wishList});
};

const addItem = (req,res,next)=>{
    const userId = req.params.uid;
    const {id, type, title, price} = req.body;
    const newItem={
        id,
        type,
        title,
        price
    };

    const wishlistbyId = DUMMY_WISH.find(item => item.user_id === +userId);

    if (!wishlistbyId) {
        return next(new HttpError('Could not find user by the provided id', 404));
    }

    wishlistbyId.movie_tv.push(newItem);
    res.status(201).json(newItem);

};

const removeItem = (req, res, next) => {
    const userId = req.params.uid;
    const itemId = req.params.itemId; 

    const wishlistbyId = DUMMY_WISH.find(item => item.user_id === +userId);
    if (!wishlistbyId) {
        return next(new HttpError('Could not find user by the provided id', 404));
    }
    const itemIndex = wishlistbyId.movie_tv.findIndex(item => item.id === +itemId);
    if (itemIndex === -1) {
        return next(new HttpError('Could not find item with the provided id', 404));
    }

    const removedItem = wishlistbyId.movie_tv.splice(itemIndex, 1);
    res.status(200).json({
        message: 'Item removed successfully',
        removedItem: removedItem[0]
    });
};

const getWishlistSize = (req, res, next) => {
    const userId = req.params.uid; 
    const wishlistbyId = DUMMY_WISH.find(item => item.user_id === +userId);

    if (!wishlistbyId) {
        return next(new HttpError('Could not find user by the provided ID', 404));
    }
    const wishlistSize = wishlistbyId.movie_tv.length;

    res.status(200).json({
        userId: userId,
        wishlistSize: wishlistSize
    });
};



exports.getWishlistbyUserid = getWishlistbyUserid;
exports.addItem = addItem;
exports.removeItem = removeItem;
exports.getWishlistSize= getWishlistSize;