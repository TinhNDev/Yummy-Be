module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('Users', {
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      defaults: false,
    }
  });
  return User;
};
