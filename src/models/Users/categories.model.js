module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define('Categories', {
    name: {
      type: Sequelize.STRING,
    },
    thumnail: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
  });
  return Categories;
};
