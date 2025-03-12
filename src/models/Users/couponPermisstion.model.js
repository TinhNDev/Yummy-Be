module.exports = (sequelize, Sequelize) => {
  const CouponPermission = sequelize.define("coupon-permission", {
    name: Sequelize.STRING,
    rule: Sequelize.TEXT,
  });
  return CouponPermission;
};
