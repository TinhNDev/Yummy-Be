const { Restaurant, Profile, Customer } = require("../../models/index.model");

class AdminService {
  static getAllRestaurant = async () => {
    return Restaurant.findAll();
  };
  static getAllOrder = async () => {
    return Restaurant.findAll();
  };
  static getAllDriver = async () => {
    const Driver = Driver.findAll({
      include: [
        {
          model: Profile,
          attribute: [],
        },
      ],
    });
    return Driver;
  };
  static getAllCustomer = async () => {
    const Customer = Customer.findAll({
      include: [
        {
          model: Profile,
          attribute: [],
        },
      ],
    });
    return Customer;
  };
}

module.exports = AdminService;
