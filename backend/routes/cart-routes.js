const express= require('express');
const router = express.Router();

const cartController = require('../controllers/cart-controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/user/:uid', cartController.getCartbyUserid);

router.post('/add/:uid', cartController.addItem);

router.delete('/delete/:uid/:itemId',cartController.removeItem);

router.get('/size/:uid', cartController.getCartSize);

router.patch('/update/:uid/:movieId', cartController.updateQuantity);

router.delete('/checkout/:uid', cartController.clearCartByUserId);

module.exports = router;

