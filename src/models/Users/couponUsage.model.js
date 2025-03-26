module.exports = (sequelize, Sequelize) => {
    const CouponUsage = sequelize.define("CouponUsage", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      coupon_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      used_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      timestamps: false,
      tableName: 'coupon_usages',
    });
  
    CouponUsage.associate = (models) => {
      // Mối quan hệ giữa CouponUsage và Coupon
      CouponUsage.belongsTo(models.Coupon, {
        foreignKey: 'coupon_id',
        as: 'coupon',
      });
  
      // Mối quan hệ giữa CouponUsage và User
      CouponUsage.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
  
      // Mối quan hệ giữa CouponUsage và Order
      CouponUsage.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
      });
    };
  
    return CouponUsage;
  };
  