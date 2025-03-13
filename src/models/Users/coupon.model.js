module.exports = (sequelize, Sequelize) => {
  const Coupon = sequelize.define("Coupon", {
    coupon_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    coupon_code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    discount_value: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false,
      validate: {
        isAfter: Sequelize.NOW,
      },
    },
    max_discount_amount: {
      type: Sequelize.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    current_uses: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  }, {
    timestamps: true,
    tableName: 'coupons',
  });

  return Coupon;
};
