const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const db = require("../../../models/index.model");
const calculateDistance = require("../../../helper/calculateDistance");
const { getRestaurantById } = require("../restaurant.service");
const { io } = require("socket.io-client");
const admin = require('firebase-admin')
const socket = io(process.env.SOCKET_SERVER_URL);
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

const getTotalPrice = async (
  userLatitude,
  userLongitude,
  restaurant_id,
  listCartItem
) => {
  let totalFoodPrice = 0;

  for (const item of listCartItem) {
    let itemTotalPrice = item.price * item.quantity;

    if (item.toppings && item.toppings.length > 0) {
      item.toppings.forEach((topping) => {
        itemTotalPrice += topping.price;
      });
    }

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

  const totalPrice = totalFoodPrice + shippingCost;

  return {
    totalFoodPrice,
    shippingCost,
    totalPrice,
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

const createOrder = async ({ order, user_id }) => {
  
  const transID = Math.floor(Math.random() * 1000000);
  const { totalFoodPrice, shippingCost, totalPrice } = await getTotalPrice(
    order.userLatitude,
    order.userLongitude,
    order.listCartItem[0].restaurant_id,
    order.listCartItem
  );
  order.delivery_fee = shippingCost;
  let customer = await db.Customer.findOne({where:{profile_id:user_id}})
  if(!customer){
    customer = await db.Customer.create({
      profile_id:user_id
    })
  };
  const configOrder = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: customer.id,
    app_time: Date.now(),
    item: JSON.stringify(order.listCartItem),
    embed_data: JSON.stringify(order),
    amount: totalPrice,
    callback_url: `${process.env.URL}/callback`,
    description: `
Thanh toán cho đơn hàng #${order.listCartItem
      .map(
        (item) => `
        Sản phẩm: ${item.name} 
        Số lượng: ${item.quantity} 
        Đơn giá: ${item.price.toLocaleString()} VND
`
      )
      .join("")}
`,
  };

  const data = `${config.app_id}|${configOrder.app_trans_id}|${configOrder.app_user}|${configOrder.amount}|${configOrder.app_time}|${configOrder.embed_data}|${configOrder.item}`;
  configOrder.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const result = await axios.post(config.endpoint, null, {
      params: configOrder,
    });
    socket.emit("backendEvent", {
      orderId: order.id,
      status: "UNPAID",
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
    return { return_code: -1, return_message: "mac not equal" };
  } else {
    const dataJson = JSON.parse(dataStr);
    const orderData = JSON.parse(dataJson["embed_data"]);
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
      customer_id: parseInt(dataJson["app_user"]),
      note: orderData.note,
      restaurant_id: orderData.listCartItem[0].restaurant_id,
      longtitude: orderData.userLongitude,
      latitude: orderData.userLatitude,
    });
    const KeyToken = await db.KeyToken.findOne({where:{id:orderData.listCartItem[0].restaurant_id}})
    try {
      const payload = {
        notification: {
          title: 'New Order',
          body: `123`,
        },
        token: KeyToken.fcmToken,
      };
      const response = await admin.messaging().send(payload);
      console.log('Successfully sent message:', response);
    } catch (error) {
      throw error
    }
    
    socket.emit("newOrderForRestaurant", {
      orderId: newOrder.id,
      restaurant_id: orderData.listCartItem[0].restaurant_id,
    });
    console.log("Thông báo đơn hàng mới đã được gửi tới server socket");

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

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1;
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    return result.data.return_message;
  } catch (error) {
    console.log("lỗi");
    console.log(error);
  }
};

module.exports = { createOrder, verifyCallback, checkStatusOrder };
