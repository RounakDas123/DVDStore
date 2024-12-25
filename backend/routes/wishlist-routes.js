const express= require('express');
const router = express.Router();

const wishlistController = require('../controllers/wishlist-controller');

router.get('/user/:uid', wishlistController.getWishlistbyUserid);

router.post('/add/:uid', wishlistController.addItem);

router.delete('/delete/:uid/:itemId',wishlistController.removeItem);

router.get('/size/:uid', wishlistController.getWishlistSize);

module.exports = router;

