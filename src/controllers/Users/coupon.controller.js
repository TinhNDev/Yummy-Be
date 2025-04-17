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

  getCouponRes = async (req, res) => {
    new SuccessResponse({
      message: 'list coupon',
      metadata: await CouponService.getCouponRes({
        restaurant_id: req.params.restaurant_id,
      })
    }).send(res)
  }

  editCoupon = async (req, res) => {
    new SuccessResponse({
      message: 'update success',
      metadata: await CouponService.editCoupon({
        restaurant_id: req.params.restaurant_id,
        body: req.body.body
      })
    }).send(res)
  }

  createFlashSale = async (req, res) => {
    new SuccessResponse({
      message: "create successfull",
      metadata: await CouponService.createFlashSale({
        body: req.body.body,
        product_id: req.body.product_id
      })
    }).send(res)
  }
  createListFlashSale = async (req, res) => {
    new SuccessResponse({
      message: "create list success",
      metadata: await CouponService.createListFlashSale({
        body: req.body,
      })
    }).send(res)
  }
  getProductForFlashSale = async (req, res) => {
    new SuccessResponse({
      message: "get full",
      metadata: await CouponService.getProductForFlashSale({
        restaurant_id: req.params.restaurant_id
      })
    }).send(res)
  }
  editFlashSale = async (req, res) => {
    new SuccessResponse({
      message: "edit success",
      metadata: await CouponService.editFlashSale({
        body: req.body.body,
        restaurant_id: req.params.restaurant_id
      })
    }).send(res)
  }
}

module.exports = new CouponController();
