const {
  Order,
  Driver,
  BlackList,
  Profile,
  Restaurant
} = require("../../../models/index.model");
const { findDriver } = require("../Restaurants/index.service");
const { io } = require("socket.io-client");
const socket = io(process.env.SOCKET_SERVER_URL);
class DriverService {
  static updateInformation = async ({ user_id, body }) => {
    const profile = await Profile.findOne({where:{user_id:user_id}})
    const driver = await Driver.findOne({ where: { profile_id: profile.id } });
    if (driver) {
      await Driver.update(
        {
          car_name: body.car_name,
          license_plate: body.license_plate,
          status: "ONLINE",
        },
        { where: { id: driver.id } }
      );
    } else {
      await Driver.create({
        license_plate: body.license_plate,
        status: "ONLINE",
        profile_id: profile.id,
      });
    }
    return await Driver.findOne({ where: { profile_id: profile.id } });
  };
  static getProfileDriver = async ({user_id}) => {
    const profile =await Profile.findOne({
      where: { user_id: user_id },
      include: [
        {
          model: Driver,
          as: `Driver`,
          atribute:[]
        },
      ],
    });
    return profile;
  };
  static confirmOrder = async ({ orderId, driver_id }) => {
    const order = await Order.findOne({ where: { id: orderId } });

    await Driver.update(
      {
        status: "ONLINE",
      },
      { where: { id: order.driver_id } }
    );
    await BlackList.update(
      {
        status: false,
      },
      { where: { order_id: order.id } }
    );
    socket.emit("backendEvent", {
      orderId: order.id,
      status: "ORDER_CONFIRMED",
    });
    return await Order.update(
      {
        order_status: "ORDER_CONFIRMED",
      },
      { where: { id: order.id } }
    );
  };
  static acceptOrder = async ({ order_id, driver_id }) => {
    const order = await Order.findOne({ where: { id: order_id } });
    if (
      order.order_status != "PREPARING_ORDER"
    ) {
      throw Error("do not have a shipper in systems");
    }
    await Order.update(
      {
        order_status: "DELIVERING",
      },
      { where: { id: order.id } }
    );
    const restaurant =await Restaurant.findOne({where:{id:order.restaurant_id}});
    socket.emit("backendEvent", {
      orderId: order_id,
      driver: order.driver_id,
      status: "FINDED  DRIVER",
    });
  
    return {
      driver: order.driver_id,
      longtitudeUser: order.longtitude,
      latitudeUser:order.latitude,
      longtitudeRes:restaurant.address_y,
      latitudeRes:restaurant.address_x
    }
  };
  static rejectOrder = async ({ order_id, driver_id }) => {
    const order = await Order.findOne({ where: { id: order_id } });
    await BlackList.create({
      order_id: order_id,
      driver_id: order.driver_id,
      status: true,
    });
    await Driver.update(
      {
        status: "ONLINE",
      },
      { where: { id: order.driver_id } }
    );
    await Order.update(
      { order_status: "ORDER_CANCELED" },
      { where: { id: order_id } }
    );
    return findDriver({ order_id });
  };

  static getAllOrderForDriver = async({driver_id})=>{
    return Order.findAll({where:{driver_id:driver_id}})
  }
  static changeStatus = async ({ driver_id }) => {
    let driver = await Driver.findOne({ where: { id: driver_id } });
    if (!driver) {
      throw new Error("Driver not found");
    }
  
    if (driver.status === 'BUSY') {
      driver.status = 'ONLINE';
    } else {
      driver.status = 'BUSY';
    }
  
    return await driver.save();
  };
}

module.exports = DriverService;
