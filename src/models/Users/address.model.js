module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define("Categories", {
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
  return Categories;
};
