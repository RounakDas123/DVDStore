const HttpError = require('../models/http-error');
const { sendEmail } = require('./emailService');


const otpStorage = new Map();

const sendOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    otpStorage.set(email, { otp, expiresAt });
    
    await sendEmail(email, 'OTP', otp);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (err) {
    console.error('Error sending OTP:', err);
    return next(new HttpError('Failed to send OTP. Please try again later.', 500));
  }
};


const verifyOtp = async (req, res, next) => {

  const { email, otp } = req.body;
  try {
    const otpData = otpStorage.get(email);
    if (!otpData) {
      return next(new HttpError('No OTP found for this email. Please request a new OTP.', 400));
    }
    if (new Date() > otpData.expiresAt) {
      otpStorage.delete(email); 
      return next(new HttpError('OTP has expired. Please request a new one.', 400));
    }
    if (otp !== otpData.otp) {
      return next(new HttpError('Invalid OTP. Please try again.', 400));
    }

    try { 
      otpStorage.delete(email);
      
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        otp: otp
      });
    } catch (emailErr) {
      return res.status(200).json({
        success: true,
        message: 'Failed to verify OTP.'
      });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return next(new HttpError('Failed to verify OTP. Please try again later.', 500));
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};