module.exports = (sequelize, Sequelize) => {
  const Driver = sequelize.define("Driver", {
    vehicle_type: {
      type: Sequelize.ENUM,
      values: ["motorbike", "car"],
    },
    license_plate: {
      type: Sequelize.STRING,
    },
    current_location: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["active", "warming", "inactive"],
    },
    phone_number: {
      type: Sequelize.INTEGER,
    },
  });
  return Driver;
};
