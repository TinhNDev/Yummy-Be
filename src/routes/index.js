'use strict';
const express = require('express');
const { apiKey, permissions } = require('../auth/checkAuth');
//callbackzalo
const { asyncHandle } = require('../helper/asyncHandler');
const paymentController = require('../controllers/Users/Customers/payment.controller');
const { KeyToken, User } = require('../models/index.model');
const userModel = require('../models/Users/user.model');
const db = require('../models/index.model');
const router = express.Router();
router.post('/callback', asyncHandle(paymentController.callBack));
router.get('/verify-email', async (req, res) => {
  const { id_token, user_id } = req.query;

  const userToVerifyEmail = await KeyToken.findOne({
    where: { id: id_token },
  });

  if (!userToVerifyEmail) {
    return res.send(`
      <html>
        <head><title>Verification Failed</title></head>
        <body style="font-family: Arial; text-align: center; padding-top: 50px;">
          <h2 style="color: red;">❌ Verification failed</h2>
          <p>The verification link is invalid or has expired.</p>
        </body>
      </html>
    `);
  }

  await db.User.update(
    { is_active: true },
    { where: { id: user_id } }
  );

  res.send(`
    <html>
      <head><title>Email Verified</title></head>
      <body style="font-family: Arial; text-align: center; padding-top: 50px;">
        <h2 style="color: green;">✅ Email Verified Successfully!</h2>
        <p>Your account has been activated. You can now log in.</p>
      </body>
    </html>
  `);
});

router.get('/verify-password', async (req, res) => {
  const { id_token, password } = req.query;

  const userToVerifyEmail = await KeyToken.findOne({
    where: { id: id_token },
  });

  await User.update(
    { password: password },
    { where: { id: userToVerifyEmail.user_id } }
  );

  if (!userToVerifyEmail) {
    return res.send('Invalid verification token');
  }

  res.send({
    accessToken: userToVerifyEmail.accessToken,
    refreshToken: userToVerifyEmail.refreshToken,
  });
});
//check apiKey
router.use(apiKey);
//check permisson
router.use(permissions('0000'));

// folder access dùng để quản lý các file liên quan với truy cập(signUp,SignIn)

router.use('/v1/api', require('./Users/product'));
router.use('/v1/api', require('./Users/categories'));
router.use('/v1/api', require('./Users/profile'));
router.use('/v1/api', require('./Users/access'));
router.use('/v1/api', require('./Users/address'));
router.use('/v1/api', require('./Users/restaurants'));
router.use('/v1/api', require('./Users/topping'));
router.use('/v1/api', require('./Users/Customers/payment'));
router.use('/v1/api', require('./Users/restaurants/orderRestaurant'));
router.use('/v1/api', require('./Users/Drivers'));
router.use('/v1/api', require('./Users/coupon'));
router.use('/v1/api', require('./Users/review'));
router.use('/v1/api', require('./Users/Customers/index'));
router.use('/v1/api', require('./Admin/index'));
router.use('/v1/api', require('./llm/index'));
router.use('/v1/api', require('./Users/cart'));
module.exports = router;
