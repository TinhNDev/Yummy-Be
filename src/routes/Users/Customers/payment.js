const express = require('express');
const { authorization, checkRole } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const paymentController = require('../../../controllers/Users/Customers/payment.controller');
const router = express.Router();

router.post("/payment", authorization,checkRole(['user','admin']), asyncHandle(paymentController.createOrder));
router.post("/checkstatus",authorization,checkRole(['user','admin']),asyncHandle(paymentController.checkStatus))
module.exports = router;