const HttpError = require('../models/http-error');

const DUMMY_CART = [
    {
        Cart_id : 1,
        user_id : 1,
        movie_tv : [{
            id: 845781,
            type: 'movie',
            title: 'Red One',
            price: 100
        }]
    },
    {
        Cart_id : 2,
        user_id : 5,
        movie_tv : [{
            id: 1241982,
            type: 'movie',
            title: 'Moana 2',
            price: 150
        },
        {
            id: 558449,
            type: 'tv',
            title: 'Royal',
            price: 450
        },
        {
            id: 939243,
            type: 'tv',
            title: 'Breaking Bad',
            price: 350
        }
    ]       
    }
];

const getCartbyUserid = (req,res,next) => {
    const userId = req.params.uid;
    const Cart = DUMMY_CART.find(c => {
        return c.user_id === +userId;
    });

    if(!Cart)
    {
        return next(new HttpError('Could not find user by the provided id',404));
    }

    res.json({Cart});
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

    const CartbyId = DUMMY_CART.find(item => item.user_id === +userId);

    if (!CartbyId) {
        return next(new HttpError('Could not find user by the provided id', 404));
    }

    CartbyId.movie_tv.push(newItem);
    res.status(201).json(newItem);

};

const removeItem = (req, res, next) => {
    const userId = req.params.uid;
    const itemId = req.params.itemId; 

    const CartbyId = DUMMY_CART.find(item => item.user_id === +userId);
    if (!CartbyId) {
        return next(new HttpError('Could not find user by the provided id', 404));
    }
    const itemIndex = CartbyId.movie_tv.findIndex(item => item.id === +itemId);
    if (itemIndex === -1) {
        return next(new HttpError('Could not find item with the provided id', 404));
    }

    const removedItem = CartbyId.movie_tv.splice(itemIndex, 1);
    res.status(200).json({
        message: 'Item removed successfully',
        removedItem: removedItem[0]
    });
};

const getCartSize = (req, res, next) => {
    const userId = req.params.uid; 
    const CartbyId = DUMMY_CART.find(item => item.user_id === +userId);

    if (!CartbyId) {
        return next(new HttpError('Could not find user by the provided ID', 404));
    }
    const CartSize = CartbyId.movie_tv.length;

    res.status(200).json({
        userId: userId,
        CartSize: CartSize
    });
};



exports.getCartbyUserid = getCartbyUserid;
exports.addItem = addItem;
exports.removeItem = removeItem;
exports.getCartSize= getCartSize;