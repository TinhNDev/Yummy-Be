const { Customer, Order, Profile, Order } = require("../../../models/index.model");

class CustomerService {
  static getAllOrderForCustomer = async ({ user_id }) => {
    const Profile =await findOne({where:{user_id:user_id}})
    const Customer =await findOne({where:{profile_id: Profile.id}}) 
    return await Order.findOne({where:{customer_id:Customer.id}})
  };
  static getOrderForCustomer = async ({ user_id, order_id }) => {
    const Customer = await Customer.findOne({ where: { user_id: user_id } });
    return await Order.findOne({
      where: { customer_id: Customer.id, id: order_id },
    });
  };
}

module.exports = CustomerService;
