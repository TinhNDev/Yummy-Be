module.exports = (sequelize, Sequelize) => {
  const Products = sequelize.define("Products", {
    name: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    descriptions: {
      type: Sequelize.STRING,
    },
    id_restaurant: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    is_available: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    }
  });

  return Products;
};
