module.exports = (sequelize, Sequelize) => {
  const Restaurants = sequelize.define("Restaurants", {
    name: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM,
      defaultValue: "pending",
      values: ["pending", "active", "deactive"]
    },
    opening_hours: {
      type: Sequelize.TEXT,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    address_x: {
      type: Sequelize.STRING,
    },
    address_y: {
      type: Sequelize.STRING,
    },
  });
  return Restaurants;
};
