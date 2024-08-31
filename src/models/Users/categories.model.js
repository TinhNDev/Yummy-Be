module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define("Categories", {
    name: {
      type: Sequelize.STRING,
    },
  });
  return Categories;
};
