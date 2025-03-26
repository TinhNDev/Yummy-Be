module.exports = (sequelize, Sequelize) => {
  const Driver = sequelize.define("Driver", {
    cic:{
      type: Sequelize.STRING,
    },
    license_plate: {
      type: Sequelize.STRING,
    },
    cccdBack: {
      type: Sequelize.STRING,
    },
    cccdFront: {
      type: Sequelize.STRING,
    },
    dob: {
      type: Sequelize.DATE,
    },
    car_name:{
      type: Sequelize.STRING,
    },
    cavet:{
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["ONLINE", "BUSY","LOCKED","PROCESSING"],
      defaultValue:"PROCESSING",
    },
  });
  return Driver;
};
