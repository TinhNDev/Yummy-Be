const { Order, Driver } = require("../../../models/index.model");

class DriverService {
  static confirmOrder = async (orderId, driver_id) => {
    await Driver.update(
      {
        status: "ONLINE",
      },
      { where: { id: driver_id } }
    );
    return await Order.update(
      {
        order_status: "ORDER_CONFIRMED",
      },
      { where: { id: orderId } }
    );
  };
  static acceptOrder = async (orderId, driver_id) =>{
    await Driver.update(
      {
        status: 'BUSY',
      },
      {where:{id:driver_id}}
    )
    return await Order.update(
      {
        order_status: "DELIVERING",
      },
      { where: { id: orderId } }
    );
  }
  static rejectOrder = async (orderId, driver_id) =>{
    
  }
}

module.exports = DriverService;
