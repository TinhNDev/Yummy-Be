module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    isVerified:{
      type: Sequelize.BOOLEAN,
    }
  });
  return User;
};
