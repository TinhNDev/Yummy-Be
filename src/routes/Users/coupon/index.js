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
router.put('/coupon/:restaurant_id/restautant', authorization, asyncHandle(couponController.editCoupon))
router.post('/coupon/flashsale', authorization, asyncHandle(couponController.createFlashSale))
router.post('/coupon/list/flashsale', authorization, asyncHandle(couponController.createListFlashSale))
router.get('/coupon/:restaurant_id/flashsale', authorization, asyncHandle(couponController.getProductForFlashSale))
module.exports = router;
