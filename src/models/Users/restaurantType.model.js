module.exports = (sequelize, Sequelize) => {
    const RestaurantTypes = sequelize.define("Restaurant Types", {
      name: {
        type: Sequelize.STRING,
      },
    });
    return RestaurantTypes;
  };
  