const {
  Customer,
  Profile,
  Order,
  Restaurant,
  Driver,
} = require("../../../models/index.model");

class CustomerService {
  static getAllOrderForCustomer = async ({ user_id }) => {
    const profile = await Profile.findOne({ where: { user_id: user_id } });
    if (!profile) throw new Error("Profile not found");

    const customer = await Customer.findOne({
        where: { profile_id: profile.id },
    });
    if (!customer) throw new Error("Customer not found");

    return await Order.findAll({
        where: { customer_id: customer.id },
        include: [
            {
                model: Restaurant,
                as: "Restaurant",
                attribute: [],
            },
            {
                model: Driver,
                attribute: [],
                as: "Driver",
                include:[{
                  model: Profile,
                  as:"Profile",
                  attributes:["name","image"]
                }]
            },
        ],
        order: [["createdAt", "DESC"]],
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
