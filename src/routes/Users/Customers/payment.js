const express = require('express');
const { authorization, checkRole } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const paymentController = require('../../../controllers/Users/Customers/payment.controller');
const router = express.Router();

router.post("/getTotal",authorization,checkRole(['user','admin']),asyncHandle(paymentController.checkCost));
router.post("/payment", authorization,checkRole(['user','admin']), asyncHandle(paymentController.createOrder));
router.post("/checkstatus",authorization,checkRole(['user','admin']),asyncHandle(paymentController.checkStatus));
router.post("/checkDiscount",authorization,checkRole(['user','admin']),asyncHandle(paymentController.checkDiscount))
module.exports = router;