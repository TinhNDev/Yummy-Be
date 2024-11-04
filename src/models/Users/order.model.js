module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("Order", {
    listCartItem:{
      type: Sequelize.JSON
    },    
    receiver_name: {
      type: Sequelize.STRING,
    },
    address_id: {
      type: Sequelize.INTEGER,
    },
    order_status: {
      type: Sequelize.ENUM,
      values: ["pending", "confirmed", "delivered"],
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
      values:["OCD","ONLINE"]
    }
  });
  return Order;
};
