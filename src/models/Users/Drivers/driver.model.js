<<<<<<< HEAD
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
=======
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
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
