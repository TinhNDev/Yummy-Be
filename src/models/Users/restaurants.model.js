module.exports = (sequelize, Sequelize) => {
  const Restaurants = sequelize.define("Restaurants", {
    name: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["pending","active","unactive"]
    }
  });
  return Restaurants;
};
