const { Customer, Profile, Order, Restaurant } = require("../../../models/index.model");

class CustomerService {
  static getAllOrderForCustomer = async ({ user_id }) => { 
    const Profile = await Profile.findOne({ where: { user_id: user_id } });
    if (!Profile) throw new Error("Profile not found");
    
    const Customer = await Customer.findOne({ where: { profile_id: Profile.id } });
    if (!Customer) throw new Error("Customer not found");
    
    return await Order.findAll({
        where: { customer_id: Customer.id },
        include: [
            {
                model: Restaurant,
                attributes: [], // Lấy thuộc tính cần thiết nếu có
            },
        ],
        order: [['createdAt', 'DESC']], // Sắp xếp theo createdAt, giảm dần để lấy order mới nhất
    });
};

  static getOrderForCustomer = async ({ user_id, order_id }) => {
    const Customer = await Customer.findOne({ where: { user_id: user_id } });
    return await Order.findOne({
      where: { customer_id: Customer.id, id: order_id },
    });
  };
}

module.exports = CustomerService;
