const { Restaurant, Profile, Driver, Order } = require("../../models/index.model");

class AdminService {
  static getAllRestaurant = async () => {
    return Restaurant.findAll();
  };
  static getAllOrder = async () => {
    return Order.findAll();
  };
  static getAllDriver = async () => {
    const driver = Driver.findAll({
      include: [
        {
          model: Profile,
          as:"Profile",
          attribute: [],
        },
      ],
    });
    return driver;
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

  static changeStatusRestaurant = async(restaurant_id)=>{
    const restaurant =await Restaurant.findOne({where:{id:restaurant_id}});
    if(restaurant.status==='pending'){
      restaurant.status ='active'
    }else {
      restaurant.status = 'pending';
    }
    return  restaurant.save();
  }
  static changeStatusDriver = async({driver_id,status})=>{
    const driver = await Driver.findByPk(driver_id);
    driver.status = status;
    return await driver.save();
  }
}

module.exports = AdminService;
