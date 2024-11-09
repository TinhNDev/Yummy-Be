// services/paymentService.js
const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require('qs');
const db = require("../../../models/index.model")
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

const createOrder = async ({ order, user_id }) => {
  const transID = Math.floor(Math.random() * 1000000);

  const embed_data = {
    redirecturl: "yourapp://payment-callback",
  };

  const configOrder = {
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: user_id,
    app_time: Date.now(),
    item: JSON.stringify(order.listCartItem),
    embed_data: JSON.stringify(order),
    amount: order.price,
    callback_url: `${process.env.URL}/callback`,
    description: `
Thanh toán cho đơn hàng #${order.listCartItem
      .map(
        (item) => `
        Sản phẩm: ${item.product_name} 
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
    return result.data.order_url;
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
    const orderData = JSON.parse(dataJson["embed_data"])

    const newOrder = await db.Order.create({
      listCartItem: orderData.listCartItem,
      receiver_name: orderData.address,
      address_receiver: orderData.address,
      order_status: orderData.order_status,
      driver_id: orderData.driver_id,
      blacklist_id: orderData.blacklist_id,
      price: orderData.price,
      phone_number: parseInt(orderData.phone_number),
      order_date: new Date(orderData.order_date),
      delivery_fee: orderData.delivery_fee,
      order_pay: orderData.order_pay,
      customer_id: dataJson["app_user"],
      note: orderData.note,
    });
    return {
      app_trans_id:dataJson["app_trans_id"],
      Order: newOrder
    }
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
    return result.data
  } catch (error) {
    console.log("lỗi");
    console.log(error);
  }
};
module.exports = { createOrder, verifyCallback,checkStatusOrder };
