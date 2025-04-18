const {
  Order,
  Driver,
  BlackList,
  Profile,
  Restaurant,
  CouponUsage,
  Customer,
  User,
} = require('../../../models/index.model');
const { UpdateProfile } = require('../profile.service');
const { findDriver } = require('../Restaurants/index.service');
const { io } = require('socket.io-client');
const socket = io(process.env.SOCKET_SERVER_URL);
class DriverService {
  static updateInformation = async ({ user_id, body }) => {
    let profile = await Profile.findOne({ where: { user_id: user_id } });
    let driver;
    let profile_id;
    if (!profile) {
      profile = await UpdateProfile({ user_id, body });
      driver = await Driver.findOne({
        where: { profile_id: profile.Profile.id },
      });
      profile_id = profile.Profile.id;
    } else {
      driver = await Driver.findOne({ where: { profile_id: profile.id } });
      profile_id = profile.id;
    }

    if (driver) {
      await Driver.update(
        {
          cic: body.cic,
          cccdBack: body.cccdBack,
          cccdFront: body.cccdFront,
          dob: body.dob,
          cavet: body.cavet,
          car_name: body.car_name,
          license_plate: body.license_plate,
          status: 'ONLINE',
        },
        { where: { id: driver.id } }
      );
    } else {
      await Driver.create({
        cic: body.cic,
        cccdBack: body.cccdBack,
        cccdFront: body.cccdFront,
        dob: body.dob,
        cavet: body.cavet,
        car_name: body.car_name,
        license_plate: body.license_plate,
        status: 'ONLINE',
        profile_id: profile_id,
      });
    }
    return await Driver.findOne({ where: { profile_id: profile_id } });
  };
  static getProfileDriver = async ({ user_id }) => {
    const profile = await Profile.findOne({
      where: { user_id: user_id },
      include: [
        {
          model: Driver,
          as: `Driver`,
          atribute: [],
        },
      ],
    });
    return profile;
  };
  static confirmOrder = async ({ order_id, driver_id }) => {
    const order = await Order.findOne({ where: { id: order_id } });

    await Driver.update(
      {
        status: 'ONLINE',
      },
      { where: { id: order.driver_id } }
    );
    await BlackList.update(
      {
        status: false,
      },
      { where: { order_id: order.id } }
    );
    socket.emit('backendEvent', {
      orderId: order.id,
      status: 'ORDER_CONFIRMED',
      driver: order.driver_id,
    });
    if (order.coupon_id) {
      const customer = await Customer.findOne({
        where: { id: order.customer_id },
      });
      const profile = await Profile.findOne({
        where: { id: customer.profile_id },
      });
      const user = await User.findOne({ where: { id: profile.user_id } });
      await CouponUsage.create({
        coupon_id: order.coupon_id,
        user_id: user.id,
        order_id: order.id,
        used_at: order.createdAt,
      });
    }
    return await Order.update(
      {
        order_status: 'ORDER_CONFIRMED',
      },
      { where: { id: order.id } }
    );
  };
  static giveOrder = async ({ order_id, driver_id }) => {
    const order = await Order.findOne({ where: { id: order_id } });
    if (order.order_status != 'DELIVERING') {
      throw Error('do not have a shipper in systems');
    }
    order.order_status = 'ORDER_RECEIVED';
    order.save();
    socket.emit('backendEvent', {
      orderId: order_id,
      driver: order.driver_id,
      status: 'GIVED ORDER',
    });
    return order;
  };
  static acceptOrder = async ({ order_id, driver_id }) => {
    const order = await Order.findOne({ where: { id: order_id } });
    if (order.order_status != 'PREPARING_ORDER') {
      throw Error('do not have a shipper in systems');
    }
    await Order.update(
      {
        order_status: 'DELIVERING',
      },
      { where: { id: order.id } }
    );
    const restaurant = await Restaurant.findOne({
      where: { id: order.restaurant_id },
    });
    socket.emit('backendEvent', {
      orderId: order_id,
      driver: order.driver_id,
      status: 'DELIVERING',
    });

    return {
      driver: order.driver_id,
      longtitudeUser: order.longtitude,
      latitudeUser: order.latitude,
      longtitudeRes: restaurant.address_y,
      latitudeRes: restaurant.address_x,
    };
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
        status: 'ONLINE',
      },
      { where: { id: order.driver_id } }
    );
    await Order.update(
      { order_status: 'ORDER_CANCELED' },
      { where: { id: order_id } }
    );
    return findDriver({ order_id });
  };

  static getAllOrderForDriver = async ({ driver_id, date }) => {
    const profile = await Profile.findOne({ where: { user_id: driver_id } });
    const driver = await Driver.findOne({ where: { profile_id: profile.id } });
    let whereClause = { driver_id: driver.id };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      whereClause.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    return await Order.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
  };
  static changeStatus = async ({ driver_id }) => {
    let driver = await Driver.findOne({ where: { id: driver_id } });
    if (!driver) {
      throw new Error('Driver not found');
    }

    if (driver.status === 'BUSY') {
      driver.status = 'ONLINE';
    } else {
      driver.status = 'BUSY';
    }

    return await driver.save();
  };

  static getDetailToHis = async ({ driver_id }) => {
    const driver = await Driver.findOne({ where: { id: driver_id } });
    const profile = await Profile.findOne({ where: { id: driver.profile_id } });

    return { ...driver.dataValues, ...profile.dataValues };
  };
}

module.exports = DriverService;
