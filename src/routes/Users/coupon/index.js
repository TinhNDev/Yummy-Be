const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const couponController = require("../../../controllers/Users/coupon.controller");

const router = express.Router();

router.get("/coupon", asyncHandle(couponController.getCoupon));

module.exports = router;
