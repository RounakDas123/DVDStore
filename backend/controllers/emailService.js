const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { HttpError } = require('../models/http-error');

// OAuth2 client configuration
const oAuth2Client = new google.auth.OAuth2(
  '1034333000574-ai1h17362uv1837taoesgaog7e3d1vrq.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground'
);

// Set the refresh token
oAuth2Client.setCredentials({
  refresh_token: '1//04D8Zqv8vwvtMCgYIARAAGAQSNwF-L9IrZH5o2CCdGUZeAeuq_mxvHvmIiUxcJCipE7QmsPhHBZnAMI8Uh4Gmy_W9vfV2SsVuXI4'
});

// Email transporter with OAuth2
let transporter;
const createTransporter = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'dvdstoreservice1@gmail.com',
        clientId: '1034333000574-ai1h17362uv1837taoesgaog7e3d1vrq.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04D8Zqv8vwvtMCgYIARAAGAQSNwF-L9IrZH5o2CCdGUZeAeuq_mxvHvmIiUxcJCipE7QmsPhHBZnAMI8Uh4Gmy_W9vfV2SsVuXI4',
        accessToken: accessToken.token
      }
    });

    // Verify email configuration
    transporter.verify((error) => {
      if (error) {
        console.error('Email configuration error:', error);
      } else {
        console.log('Email service is ready');
      }
    });
  } catch (error) {
    console.error('Error creating OAuth2 transporter:', error);
    throw new HttpError('Failed to initialize email service', 500);
  }
};

// Initialize the transporter when the module loads
createTransporter();

// Email templates (unchanged from your original code)
const emailTemplates = {
  OTP: (otp) => ({
    subject: 'Your Verification Code',
    text: `Your verification code is: ${otp}`,
    html: `
      <div style="background: #E8CC8C; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <div style="margin-bottom: 20px;">
          <img src="cid:logo@dvdstore" alt="DVDStore Logo" style="max-width: 600px; height: auto;">
        </div>
        <h2 style="color: #7d2ae8;">Verification Code</h2>
        <p>Please use the following verification code:</p>
          <div style="display: inline-block; background: #F7C044; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">
            ${otp}
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p style="color: #888; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `
  }),
  WELCOME: (name) => ({
    subject: 'Welcome to DVDStore',
    text: `Welcome ${name}! Thank you for joining DVDStore.`,
    html: `
      <div style="background: #E8CC8C; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <div style="margin-bottom: 20px;">
          <img src="cid:logo@dvdstore" alt="DVDStore Logo" style="max-width: 600px; height: auto;">
        </div>
        <h2 style="color: #7d2ae8;">Welcome ${name}!</h2>
        <p>Thank you for registering with DVDStore.</p>
        <p>We're excited to have you on board!</p>
      </div>
    `
  }),
  CHECKOUT: (orderDetails) => ({
    subject: 'Your DVDStore Order Confirmation',
    text: `Thank you for your order!\n\nOrder ID: ${orderDetails.orderId}\nAmount: ₹${orderDetails.amount}\nItems: ${orderDetails.items.join(', ')}`,
    html: `
      <div style="background: #E8CC8C; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <div style="margin-bottom: 20px;">
          <img src="cid:logo@dvdstore" alt="DVDStore Logo" style="max-width: 600px; height: auto;">
        </div>
        <h2 style="color: #7d2ae8;">Order Confirmation</h2>
        <p>Thank you for your purchase from DVDStore!</p>
        
        <div style="display: inline-block; background: #F7C044; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Summary</h3>
          <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ₹${orderDetails.amount}</p>
          
          <h4>Items:</h4>
          <ul style="padding-left: 20px;">
            ${orderDetails.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        
        <p>We'll notify you when your order ships.</p>
      </div>
    `
  }),
  PROFILE_UPDATE: (userDetails) => ({
    subject: 'DVDStore Profile Update Confirmation',
    text: `Your profile has been successfully updated.\n\nName: ${userDetails.user_name}\nEmail: ${userDetails.email_id}`,
    html: `
      <div style="background: #E8CC8C; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <div style="margin-bottom: 20px;">
          <img src="cid:logo@dvdstore" alt="DVDStore Logo" style="max-width: 600px; height: auto;">
        </div>
        <h2 style="color: #7d2ae8;">Profile Updated Successfully</h2>
        <p>Hi ${userDetails.user_name}, your DVDStore profile information has been updated as requested.</p>
        
        <p>If you didn't make these changes, please contact our support team immediately.</p>
      </div>
    `
  })
};

const sendEmail = async (to, templateName, templateData, from = 'dvdstoreservice1@gmail.com') => {
  try {
    if (!emailTemplates[templateName]) {
      throw new Error(`Template ${templateName} not found`);
    }

    const template = emailTemplates[templateName](templateData);

    const mailOptions = {
      from: `"DVDStore \u{1F3AC}" <${from}>`,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
      attachments: [{
      filename: 'logo_mini2.jpg',
      path: './images/logo_mini2.jpg', 
      cid: 'logo@dvdstore' 
  }]
    };

    // Ensure transporter is ready
    if (!transporter) {
      await createTransporter();
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new HttpError('Failed to send email', 500);
  }
};

module.exports = {
  sendEmail,
  emailTemplates
};