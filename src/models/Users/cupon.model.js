module.exports = (sequelize, Sequelize) => {
  const Cupon = sequelize.define("Cupon", {
    cupon_name:Sequelize.STRING,
    cupon_code: Sequelize.STRING,
    price : Sequelize.STRING,
    amount: Sequelize.INTEGER
  });
  return Cupon;
};
