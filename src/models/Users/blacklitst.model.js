module.exports = (sequelize, Sequelize) => {
  const BlackList = sequelize.define('Black List', {
    status: {
      type: Sequelize.BOOLEAN,
    },
  });
  return BlackList;
};
