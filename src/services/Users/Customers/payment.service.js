const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const db = require('../../../models/index.model');
const calculateDistance = require('../../../helper/calculateDistance');
const { getRestaurantById } = require('../restaurant.service');
const { io } = require('socket.io-client');
const admin = require('firebase-admin');
const { addCouponToOrder } = require('../coupon.service');
const RedisHelper = require('../../../cache/redis');
const socket = io(process.env.SOCKET_SERVER_URL);
const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

const getTotalPrice = async (
  userLatitude,
  userLongitude,
  restaurant_id,
  listCartItem,
  discountCost
) => {
  let totalFoodPrice = 0;

  for (const item of listCartItem) {
    let itemTotalPrice = item.price * item.quantity;
    totalFoodPrice += itemTotalPrice;
  }

  const restaurant = await getRestaurantById(restaurant_id);
  const { distance } = await calculateDistance(
    userLatitude,
    userLongitude,
    restaurant.address_x,
    restaurant.address_y
  );
  const shippingCost = calculateShippingCost(distance);

  const totalPrice = totalFoodPrice + shippingCost - discountCost;

  return {
    totalFoodPrice,
    shippingCost,
    totalPrice,
    discountCost,
  };
};

const calculateShippingCost = (distanceInKm) => {
  const minimumFare = 15000;
  const maxDistanceForMinimumFare = 3;
  const extraKmFare = 5000;

  if (distanceInKm <= maxDistanceForMinimumFare) {
    return minimumFare;
  } else {
    const extraKm = parseFloat(distanceInKm) - maxDistanceForMinimumFare;
    return minimumFare + extraKm * extraKmFare;
  }
};

const calculateDiscount = (coupon, listCartItem) => {
  let totalFoodPrice = 0;

  for (const item of listCartItem) {
    let itemTotalPrice = item.price * item.quantity;
    totalFoodPrice += itemTotalPrice;
  }

  return coupon.discount_type === 'PERCENTAGE'
    ? coupon.discount_value * totalFoodPrice
    : totalFoodPrice - coupon.discount_value;
};

const createOrder = async ({ order, user_id }) => {
  const transID = Math.floor(Math.random() * 1000000);

  const profile = await db.Profile.findOne({ where: { user_id: user_id } });
  if (!profile) {
    throw new Error('User profile not found');
  }

  let customer = await db.Customer.findOne({
    where: { profile_id: profile.id },
  });
  if (!customer) {
    try {
      customer = await db.Customer.create({ profile_id: profile.id });
    } catch (error) {
      throw new Error('Failed to create customer: ' + error.message);
    }
  }

  const configOrder = {
    app_id: config.app_id,
    app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
    app_user: customer.id,
    app_time: Date.now(),
    item: JSON.stringify(order.listCartItem),
    embed_data: JSON.stringify(order),
    amount: order.price,
    callback_url: `${process.env.URL}/callback`,
    description: `Cảm ơn đã sử dụng`,
  };

  const data = `${config.app_id}|${configOrder.app_trans_id}|${configOrder.app_user}|${configOrder.amount}|${configOrder.app_time}|${configOrder.embed_data}|${configOrder.item}`;
  configOrder.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, {
      params: configOrder,
    });

    return {
      url: result.data.order_url,
      app_trans_id: configOrder.app_trans_id,
    };
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

const verifyCallback = async ({ dataStr, reqMac }) => {
  const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

  if (reqMac !== mac) {
    return { return_code: -1, return_message: 'mac not equal' };
  } else {
    const dataJson = JSON.parse(dataStr);
    const orderData = JSON.parse(dataJson['embed_data']);
    // Tạo đơn hàng mới trong database
    const newOrder = await db.Order.create({
      listCartItem: orderData.listCartItem,
      receiver_name: orderData.receiver_name,
      address_receiver: orderData.address_receiver,
      order_status: 'PAID',
      driver_id: orderData.driver_id,
      blacklist_id: orderData.blacklist_id,
      price: dataJson.amount,
      phone_number: parseInt(orderData.phone_number),
      order_date: new Date(orderData.order_date),
      delivery_fee: orderData.delivery_fee,
      order_pay: orderData.order_pay,
      customer_id: parseInt(dataJson['app_user']),
      note: orderData.note,
      restaurant_id: orderData.listCartItem[0].restaurant_id,
      longtitude: orderData.userLongitude,
      latitude: orderData.userLatitude,
      coupon_id: orderData.coupon_id,
    });
    const restaurant = await db.Restaurant.findOne({
      where: { id: orderData.listCartItem[0].restaurant_id },
    });
    const KeyToken = await db.KeyToken.findOne({
      where: { id: restaurant.user_id },
    });

    // if (KeyToken.fcmToken) {
    //   const payload = {
    //     notification: {
    //       title: "New Order",
    //       body: `Bạn có 1 đơn hàng mới`,
    //     },
    //     token: KeyToken.fcmToken,
    //   };
    //   const response = await admin.messaging().send(payload);
    //   console.log("Successfully sent message:", response);
    // }
    socket.emit('backendEvent', {
      driver: 'null',
      orderId: newOrder.id,
      status: 'PAID',
    });
    newOrder.coupon_id?.(
      await addCouponToOrder(newOrder.id, newOrder.coupon_id)
    );
    socket.emit('newOrderForRestaurant', {
      order: newOrder,
      restaurant_id: orderData.listCartItem[0].restaurant_id,
    });
    console.log('Thông báo đơn hàng mới đã được gửi tới server socket');
    const customer = await db.Customer.findOne({
      where: { id: newOrder.customer_id },
    });
    const profile = await db.Profile.findOne({
      where: { id: customer.profile_id },
    });
    const redisKey = `cart:${profile.user_id}-${orderData.listCartItem[0].restaurant_id}`;
    const redisHelper = new RedisHelper();
    await redisHelper.connect();
    await redisHelper.delete(redisKey);
    return {
      Order: newOrder,
    };
  }
};

const checkStatusOrder = async ({ app_trans_id }) => {
  let postData = {
    app_id: config.app_id,
    app_trans_id,
  };

  let data = postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: 'post',
    url: 'https://sb-openapi.zalopay.vn/v2/query',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    return result.data.return_message;
  } catch (error) {
    console.log('lỗi');
    console.log(error);
  }
};

module.exports = {
  createOrder,
  verifyCallback,
  checkStatusOrder,
  getTotalPrice,
  calculateDiscount,
};
