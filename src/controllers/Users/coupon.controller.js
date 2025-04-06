const { SuccessResponse } = require('../../core/success.response');
const CouponService = require('../../services/Users/coupon.service');

class CouponController {
  getCoupon = async (req, res) => {
    new SuccessResponse({
      message: 'list coupon',
      metadata: await CouponService.getCoupon({
        totalCost: req.params.totalCost,
        user_id: req.user.user_id,
      }),
    }).send(res);
  };

  createCoupon = async (req, res) => {
    new SuccessResponse({
      message: 'create success',
      metadata: await CouponService.createCoupon({
        body: req.body,
      }),
    }).send(res);
  };

  searchCoupon = async (req, res) => {
    new SuccessResponse({
      message: 'coupon',
      metadata: await CouponService.searchCouponsByName({
        name: req.body.name,
      }),
    }).send(res);
  };
}

module.exports = new CouponController();
