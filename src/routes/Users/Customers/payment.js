const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const paymentController = require('../../../controllers/Users/Customers/payment.controller');
const router = express.Router();

router.post("/payment", authorization, asyncHandle(paymentController.createOrder));
router.post("/checkstatus",authorization,asyncHandle(paymentController.checkStatus))
module.exports = router;