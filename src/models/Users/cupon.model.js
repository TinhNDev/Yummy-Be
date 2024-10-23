module.exports = (sequelize, Sequelize) => {
  const Cupon = sequelize.define("Cupon", {
    cupon_code: Sequelize.STRING,
  });
  return Cupon;
};
