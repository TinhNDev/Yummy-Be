module.exports = (sequelize, Sequelize) => {
  const Profile = sequelize.define('Profile', {
    name: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.INTEGER,
    },
  });
  return Profile;
};
