const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const couponController = require("../../../controllers/Users/coupon.controller");
const { authorization, checkRole } = require("../../../auth/authUtils");

const router = express.Router();

router.post("/coupon",authorization,checkRole(['admin']),asyncHandle(couponController.createCoupon));
router.post("/coupon/:coupon_name/customer",authorization, asyncHandle(couponController.searchCoupon));
router.get("/coupon",authorization,asyncHandle(couponController.getCoupon));

module.exports = router;
