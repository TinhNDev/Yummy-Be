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
    id_categories: {
      type: Sequelize.INTEGER,
    },
    id_toping: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.INTEGER,
    },
  });

  return Products;
};
