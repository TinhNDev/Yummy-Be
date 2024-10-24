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
      values: ["pending","active","unactive"]
    },
    opening_hours:{
      type: Sequelize.STRING,
    },
    phone_number:{
      type: Sequelize.STRING,
    },
    description:{
      type: Sequelize.TEXT,
    }
  });
  return Restaurants;
};
