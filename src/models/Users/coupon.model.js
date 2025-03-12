module.exports = (sequelize, Sequelize) => {
  const Coupon = sequelize.define("Coupon", {
    coupon_name: Sequelize.STRING,
    coupon_code: Sequelize.STRING,
    price: Sequelize.STRING,
    amount: Sequelize.INTEGER,
  });
  return Coupon;
};
