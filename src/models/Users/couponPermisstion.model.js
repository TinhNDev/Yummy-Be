module.exports = (sequelize, Sequelize) => {
  const CouponPermission = sequelize.define("CouponPermission", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    coupon_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Coupons', // Liên kết với bảng coupons
        key: 'id',
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false, // Tên quyền phải có
    },
    restriction_type: {
      type: Sequelize.ENUM('user', 'restaurant', 'dish', 'category'),
      allowNull: false, // Loại ràng buộc: user, restaurant, dish, hoặc category
    },
    restriction_value: {
      type: Sequelize.INTEGER,
      allowNull: false, // ID đối tượng áp dụng ràng buộc
    },
    rule: {
      type: Sequelize.TEXT,
      allowNull: true, // Quy tắc cho quyền, có thể là văn bản mô tả hoặc điều kiện thêm
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true, // Mặc định là quyền hoạt động
    },
  }, {
    timestamps: true, // Tạo các trường createdAt và updatedAt tự động
    tableName: 'coupon_permissions', // Tên bảng trong cơ sở dữ liệu
  });

  return CouponPermission;
};
