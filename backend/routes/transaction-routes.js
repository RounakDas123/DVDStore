const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transaction-controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.post('/checkout/:uid', transactionController.addTransaction);
router.get('/:uid', transactionController.getTransactionsByUserId); 

module.exports = router;