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
        defaultValue: Sequelize.NOW, // Mặc định là thời gian hiện tại
      },
      discount_amount: {
        type: Sequelize.INTEGER,
        allowNull: false, // Số tiền giảm phải có
      },
    }, {
      timestamps: false, // Không cần tạo createdAt, updatedAt cho bảng này
      tableName: 'coupon_usages', // Tên bảng trong cơ sở dữ liệu
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
  