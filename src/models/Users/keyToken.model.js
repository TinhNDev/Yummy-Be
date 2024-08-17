module.exports = (sequelize, Sequelize) => {
  const KeyToken = sequelize.define("Key Token", {
    usedId: {
      type: Sequelize.INTEGER,
    },
    publicKey: {
      type: Sequelize.STRING,
    },
    privateKey: {
      type: Sequelize.STRING,
    },
    refreshTokenUser: {
      type: Sequelize.STRING,
    },
    refreshToken: {
      type: Sequelize.STRING,
    },
  });
  return KeyToken;
};
