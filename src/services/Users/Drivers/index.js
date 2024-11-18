const { Order, Driver, BlackList } = require("../../../models/index.model");
const { findDriver } = require("../Restaurants/index.service");

class DriverService {
  static updateInformation = async({user_id, body})=>{
    const driver = await Driver.findOne({where:{profile_id:user_id}})
    if(driver){
      await Driver.update({
        license_plate:body.license_plate,
        status: 'ONLINE',
      },
      {where:{profile_id:user_id}}  
      )
    } else {
      await Driver.create({
        license_plate:body.license_plate,
        status: 'ONLINE',
        profile_id:user_id
      },
    )
    }
    return await Driver.findOne({where:{profile_id:user_id}})
  }
  static confirmOrder = async (orderId, driver_id) => {
    await Driver.update(
      {
        status: "ONLINE",
      },
      { where: { id: driver_id } }
    );
    await BlackList.update(
      {
        status: false,
      },
      { where: { order_id: orderId } }
    );
    return await Order.update(
      {
        order_status: "ORDER_CONFIRMED",
      },
      { where: { id: orderId } }
    );
  };
  static acceptOrder = async (orderId, driver_id) => {
    await Driver.update(
      {
        status: "BUSY",
      },
      { where: { id: driver_id } }
    );
    return await Order.update(
      {
        order_status: "DELIVERING",
      },
      { where: { id: orderId } }
    );
  };
  static rejectOrder = async (orderId, driver_id) => {
    await BlackList.create({
      order_id: orderId,
      driver_id: driver_id,
      status: true,
    });
    const order = await Order.findOne({ where: { id: orderId } });
    findDriver(order.restaurant_id, orderId);
  };
}

module.exports = DriverService;
