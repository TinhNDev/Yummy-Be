module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("Order", {
    listCartItem:{
      type: Sequelize.JSON
    },    
    receiver_name: {
      type: Sequelize.STRING,
    },
    address_receiver: {
      type: Sequelize.TEXT,
    },
    order_status: {
      type: Sequelize.ENUM,
      values: ['PAID','UNPAID','PREPARING_ORDER','ORDER_CANCELED','ORDER_RECEIVED','DELIVERING','ORDER_CONFIRMED'],
    },
    driver_id: {
      type: Sequelize.INTEGER,
    },
    blacklist_id: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.DECIMAL,
    },
    phone_number: {
      type: Sequelize.INTEGER,
    },
    order_date: {
      type: Sequelize.DATE,
    },
    delivery_fee: {
      type: Sequelize.DECIMAL,
    },
    order_pay:{
      type: Sequelize.ENUM,
      values:["OCD","ZALOPAY"]
    },
    note:{
      type: Sequelize.TEXT,
    }
  });
  return Order;
};
