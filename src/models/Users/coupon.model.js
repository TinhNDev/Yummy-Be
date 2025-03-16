module.exports = (sequelize, Sequelize) => {
  const Coupon = sequelize.define(
    "Coupon",
    {
      coupon_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coupon_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      discount_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      discount_type: {
        type: Sequelize.ENUM("PERCENTAGE", "FIXED_AMOUNT"),
        allowNull: false,
        defaultValue: "PERCENTAGE",
      },
      max_discount_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      min_order_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          min: 0,
        },
      },
      max_uses_per_user: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
        },
      },
      current_uses: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          isDate: true,
          isAfterStartDate(value) {
            if (this.start_date && value <= this.start_date) {
              throw new Error("end_date phải lớn hơn start_date");
            }  
          },
        },
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      tableName: "coupons",
    }
  );

  return Coupon;
};
