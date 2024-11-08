// services/paymentService.js
const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
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
    merchant_name: order.receiver_name,
    app_id: config.app_id,
    app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
    app_user: order.receiver_name,
    app_time: Date.now(),
    item: JSON.stringify(order.listCartItem),
    embed_data: JSON.stringify(embed_data),
    amount: order.price,
    callback_url: `${process.env.URL_SYSTEM}/callback`,
    description: `
Thanh toán cho đơn hàng #${order.listCartItem
      .map(
        (item) => `
        Sản phẩm: ${item.product_name} 
        Số lượng: ${item.quantity} 
        Đơn giá: ${item.unit_price.toLocaleString()} VND
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
    return result.data;
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};

const verifyCallback = (dataStr, reqMac) => {
  const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

  if (reqMac !== mac) {
    return { return_code: -1, return_message: "mac not equal" };
  } else {
    const dataJson = JSON.parse(dataStr);

    // Update trạng thái đơn hàng dựa trên app_trans_id
    console.log(
      "Update order's status = success where app_trans_id =",
      dataJson["app_trans_id"]
    );
    return { return_code: 1, return_message: "success" };
  }
};

module.exports = { createOrder, verifyCallback };
