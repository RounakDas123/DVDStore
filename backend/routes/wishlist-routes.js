const express= require('express');
const router = express.Router();

const wishlistController = require('../controllers/wishlist-controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/user/:uid', wishlistController.getWishlistbyUserid);

router.post('/add/:uid', wishlistController.addItem);

router.delete('/delete/:uid/:itemId',wishlistController.removeItem);

router.get('/size/:uid', wishlistController.getWishlistSize);

module.exports = router;

