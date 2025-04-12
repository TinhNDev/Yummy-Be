const express = require('express');
const { asyncHandle } = require('../../../helper/asyncHandler');
const couponController = require('../../../controllers/Users/coupon.controller');
const { authorization, checkRole } = require('../../../auth/authUtils');

const router = express.Router();

router.post(
  '/coupon',
  authorization,
  asyncHandle(couponController.createCoupon)
);
router.post(
  '/coupon/:coupon_name/customer',
  authorization,
  asyncHandle(couponController.searchCoupon)
);
router.get(
  '/coupon/:totalCost',
  authorization,
  asyncHandle(couponController.getCoupon)
);
router.get('/coupon/:restaurant_id/restaurant', authorization, asyncHandle(couponController.getCouponRes))

module.exports = router;
