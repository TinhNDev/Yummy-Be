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
    price: {
      type: Sequelize.INTEGER,
    },
    quantity: {
      type: Sequelize.INTEGER,
    },
    is_available: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    is_public:{
      type: Sequelize.BOOLEAN
    },
    is_draft:{
      type: Sequelize.BOOLEAN,
      default: true,
    }
  });

  return Products;
};
