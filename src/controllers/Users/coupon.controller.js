const { SuccessResponse } = require("../../core/success.response");
const CouponService = require("../../services/Users/coupon.service");

class CouponController {
  getCoupon = async (req, res) => {
    new SuccessResponse({
      message: "123",
      metadata: await CouponService.getCoupon(),
    }).send(res);
  };
}

module.exports = new CouponController();
