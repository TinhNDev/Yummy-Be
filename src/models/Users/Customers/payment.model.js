module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define("Payment", {
    order_id: {
      type: Sequelize.INTEGER,
    },
    payment_method: {
      type: Sequelize.ENUM,
      values: ["OCD", "ZALOPAY"],
    },
    payment_amount: {
      type: Sequelize.DECIMAL(10, 2),
    },
    payment_status: {
      type: Sequelize.ENUM,
      values: ["pending", "succeeded", "failed"],
      defaultValue: "pending",
    },
    payment_date: {
      type: Sequelize.DATE,
    },
    payment_ref_id: {
      type: Sequelize.STRING,
    },
    payment_provider: {
      type: Sequelize.STRING,
    },
    payment_metadata: {
      type: Sequelize.JSON,
    },
  });

  return Payment;
};
