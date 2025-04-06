module.exports = (sequelize, Sequelize) => {
  const Notifications = sequelize.define('Notifications', {
    title: {
      type: Sequelize.STRING,
    },
    body: {
      type: Sequelize.JSON,
    },
    token: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    driver_id: {
      type: Sequelize.INTEGER,
    },
    order_id: {
      type: Sequelize.INTEGER,
    },
  });
  return Notifications;
};
