const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const cartController = require('../../../controllers/Users/Customers/cart.controller');
const paymentController = require('../../../controllers/Users/Customers/payment.controller');
const router = express.Router();

router.post("/payment", authorization, asyncHandle(paymentController.createOrder));

module.exports = router;