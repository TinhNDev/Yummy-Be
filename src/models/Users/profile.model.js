module.exports = (sequelize, Sequelize) => {
  const Profile = sequelize.define("Profile", {
    name: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATE,
    },
    id_address: {
      type: Sequelize.INTEGER,
    },
    phone_number: {
      type: Sequelize.INTEGER,
    },
    mail: {
      type: Sequelize.STRING,
    },
  });
  return Profile;
};
