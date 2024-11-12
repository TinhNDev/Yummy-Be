const { Restaurant, Order, Order } = require("../../../models/index.model")

class OrderRestaunrantService{
    static getOrder = async({restaurant_id}) =>{
        return Order.findAll({where:{restaurant_id: restaurant_id}});
    }

    static changeStatusOrder = async({orderId, status}) =>{
        const order = await db.Order.findByPk(orderId);
        if (order) {
            order.status = status;
            await order.save();
            return order;
        }
    }

    //gửi đơn cho tài xế gần đó
    //thiết lập các thông báo
    //quản lý hoàn tiền huy đơn
}

module.exports = OrderRestaunrantService