const express= require('express');
const router = express.Router();

const cartController = require('../controllers/cart-controller');

router.get('/user/:uid', cartController.getCartbyUserid);

router.post('/add/:uid', cartController.addItem);

router.delete('/delete/:uid/:itemId',cartController.removeItem);

router.get('/size/:uid', cartController.getCartSize);

module.exports = router;

