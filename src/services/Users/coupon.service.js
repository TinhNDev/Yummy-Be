
/**
 *  Tạo mới, chỉnh sửa, xóa và quản lý mã giảm giá
    Kiểm tra tính hợp lệ của mã giảm giá khi khách hàng áp dụng
    Hỗ trợ nhiều loại giảm giá: theo phần trăm, số tiền cố định, miễn phí giao hàng
    Giới hạn sử dụng: theo thời gian, số lần sử dụng, người dùng cụ thể
    Áp dụng cho: toàn bộ đơn hàng, món ăn cụ thể, danh mục món ăn, nhà hàng cụ thể
    Thống kê việc sử dụng mã giảm giá
 */
const { Restaurant, Coupon } = require("../../models/index.model");

class CouponService {
  static getCoupon = async () => {
    return await Coupon.findAll();
  };

  static createCoupon = async ({ body }) => {
    const { coupon_code, price, amount, coupon_name } = body;
    return await Restaurant.create({
      cupon_name: coupon_name,
      cupon_code: coupon_code,
      price: price,
      amount: amount,
    });
  };

  static findCouponWithCodeCoupon = async (coupon_code) => {
    const coupon = Coupon.findOne({ where: { coupon_code: coupon_code } });
    if (!coupon) {
      throw "Do not have a coupon with code";
    }
    return coupon;
  };

  static addCouponToOrder = async (coupon_id) => {
    const coupon = await Coupon.findOne({ where: { id: coupon_id } });
    return await Coupon.update(
      {
        where: coupon.id,
      },
      {
        amount: coupon.amount - 1,
      }
    );
  };
}

module.exports = CouponService;
