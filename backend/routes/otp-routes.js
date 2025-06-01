const express = require('express');
const router = express.Router();

const otpController = require('../controllers/OTP-controller');
//const checkAuth = require('../middleware/check-auth');

//router.use(checkAuth);

router.post('/send-otp', otpController.sendOtp);
router.post('/verify-otp', otpController.verifyOtp);

module.exports = router;
