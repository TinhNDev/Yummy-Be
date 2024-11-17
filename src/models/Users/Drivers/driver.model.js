module.exports = (sequelize, Sequelize) => {
  const Driver = sequelize.define("Driver", {
    license_plate: {
      type: Sequelize.STRING,
    },
    latitude:{
      type: Sequelize.STRING,
    },
    longitude:{
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["ONLINE", "BUSY", "WARMING","LOCKED","PROCESSING"],
      defaultValue:"PROCESSING",
    },
  });
  return Driver;
};
