module.exports = (sequelize, Sequelize) => {
  const KeyToken = sequelize.define("Key Token", {
    publicKey: {
      type: Sequelize.TEXT,
    },
    privateKey: {
      type: Sequelize.TEXT,
    },
    refreshTokenUsed: {
      type: Sequelize.JSON,
    },
    refreshToken: {
      type: Sequelize.TEXT,
    },
    fcmToken:{
      type: Sequelize.TEXT,
    },
  });
  return KeyToken;
};
