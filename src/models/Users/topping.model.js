module.exports = (sequelize, Sequelize) => {
  const Topping = sequelize.define("Topping", {
    topping_name: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.DECIMAL,
    },
    is_available: {
      type: Sequelize.BOOLEAN,
    },
  });
  return Topping;
};
