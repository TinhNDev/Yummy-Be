const db = require('../../models/index.model');

class OrderService {
  /**
   * @param {Object} body - dữ liệu đơn hàng từ request
   * @param {Number} user_id - ID của người dùng tạo đơn hàng
   * @returns {Object} - thông tin đơn hàng đã tạo hoặc thông báo lỗi
   */
  static async createOrder(body, user_id) {
    try {
      const {
        listCartItem,
        receiver_name,
        address_id,
        order_status,
        driver_id,
        blacklist_id,
        price,
        phone_number,
        order_date,
        delivery_fee,
        order_pay,
      } = body;
      const order = await db.Order.create({
        listCartItem: JSON.stringify(listCartItem),
        receiver_name: receiver_name,
        address_id: address_id,
        order_status: order_status,
        driver_id: driver_id,
        blacklist_id: blacklist_id,
        price: price,
        phone_number: phone_number,
        order_date: order_date,
        delivery_fee: delivery_fee,
        order_pay: order_pay,
        cus_id: user_id,
      });

      return order;
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Đã xảy ra lỗi khi tạo đơn hàng.',
      };
    }
  }
}

module.exports = OrderService;
