module.exports = (sequelize, Sequelize) => {
  const Topping = sequelize.define('Topping', {
    topping_name: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    is_available: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });
  return Topping;
};
