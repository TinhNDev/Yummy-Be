
/**
 *  Tạo mới, chỉnh sửa, xóa và quản lý mã giảm giá
    Kiểm tra tính hợp lệ của mã giảm giá khi khách hàng áp dụng(Mobile)
    Hỗ trợ nhiều loại giảm giá: theo phần trăm, số tiền cố định, miễn phí giao hàng(Admin web)
    Giới hạn sử dụng: theo thời gian, số lần sử dụng, người dùng cụ thể
    Áp dụng cho: toàn bộ đơn hàng, món ăn cụ thể, danh mục món ăn, nhà hàng cụ thể
    Thống kê việc sử dụng mã giảm giá
 */
const { Restaurant, Coupon } = require("../../models/index.model");

class CouponService {
  static getCoupon = async ({total, user_id}) => {
    return await Coupon.findAll();
  };

  static createCoupon = async ({ body }) => {
    const {
      coupon_name,
      coupon_code,
      amount,
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

    if (!coupon_name || !coupon_code || !amount || !discount_value || !start_date || !end_date || !coupon_type) {
      throw new Error("Vui lòng cung cấp đầy đủ thông tin bắt buộc.");
    }

    if (amount < 0 || discount_value < 0 || (max_discount_amount && max_discount_amount < 0) || (min_order_value && min_order_value < 0)) {
      throw new Error("Giá trị không hợp lệ. Các số phải lớn hơn hoặc bằng 0.");
    }

    if (max_uses_per_user && max_uses_per_user < 1) {
      throw new Error("Số lần sử dụng tối đa phải lớn hơn hoặc bằng 1.");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu.");
    }
    const existingCoupon = await Coupon.findOne({ where: { coupon_code } });
    if (existingCoupon) {
      throw new Error("Mã coupon đã tồn tại.");
    }

    return await Coupon.create({
      coupon_name,
      coupon_code,
      amount,
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
