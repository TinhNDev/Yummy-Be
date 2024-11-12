module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define("Address", {
    address_name:{
      type: Sequelize.STRING
    },
    address_x: {
      type: Sequelize.STRING,
    },
    address_y: {
      type: Sequelize.STRING,
    },
    is_default: {
      type: Sequelize.BOOLEAN,
    },
  });
  return Address;
};
