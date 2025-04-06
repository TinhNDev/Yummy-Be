const { Restaurant, Coupon, CouponUsage } = require('../../models/index.model');

class CouponService {
  static getCoupon = async ({ totalCost, user_id }) => {
    const coupons = await Coupon.findAll({ where: { is_active: true } });
    const result = [];

    for (const coupon of coupons) {
      let error = null;

      try {
        if (coupon.end_date && new Date(coupon.end_date) < new Date()) {
          error = 'Coupon has expired';
        } else if (coupon.min_order_value > totalCost) {
          error =
            'Order value does not meet the minimum requirement for this coupon';
        } else if (coupon.coupon_type === 'ONE_TIME') {
          const usage = await CouponUsage.findOne({
            where: { user_id: user_id, coupon_id: coupon.id },
          });
          if (usage) {
            error = 'User has already used this coupon';
          }
        } else if (coupon.coupon_type === 'ONE_TIME_EVERY_DAY') {
          if (coupon.current_uses >= coupon.max_uses_per_user) {
            error = 'Coupon usage limit for today has been reached';
          }
        }
      } catch (err) {
        error = `Error validating coupon: ${err.message}`;
      }

      result.push({
        coupon,
        error,
      });
    }

    return result;
  };

  static createCoupon = async ({ body }) => {
    const {
      coupon_name,
      coupon_code,
      discount_value,
      discount_type,
      max_discount_amount,
      min_order_value,
      max_uses_per_user,
      start_date,
      end_date,
      is_active,
      coupon_type,
    } = body;

    if (
      !coupon_name ||
      !coupon_code ||
      !discount_value ||
      !start_date ||
      !end_date ||
      !coupon_type
    ) {
      throw new Error('Vui lòng cung cấp đầy đủ thông tin bắt buộc.');
    }

    if (
      discount_value < 0 ||
      (max_discount_amount && max_discount_amount < 0) ||
      (min_order_value && min_order_value < 0)
    ) {
      throw new Error('Giá trị không hợp lệ. Các số phải lớn hơn hoặc bằng 0.');
    }

    if (max_uses_per_user && max_uses_per_user < 1) {
      throw new Error('Số lần sử dụng tối đa phải lớn hơn hoặc bằng 1.');
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu.');
    }
    const existingCoupon = await Coupon.findOne({ where: { coupon_code } });
    if (existingCoupon) {
      throw new Error('Mã coupon đã tồn tại.');
    }

    return await Coupon.create({
      coupon_name,
      coupon_code,
      discount_value,
      discount_type,
      max_discount_amount,
      min_order_value,
      max_uses_per_user,
      start_date,
      end_date,
      is_active: is_active !== undefined ? is_active : true,
      coupon_type,
    });
  };

  static searchCouponsByName = async ({ name }) => {
    return await Coupon.findAll({
      where: {
        coupon_name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });
  };
}

module.exports = CouponService;
