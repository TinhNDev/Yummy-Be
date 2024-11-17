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
    phone_number: {
      type: Sequelize.INTEGER,
    },
    mail: {
      type: Sequelize.STRING,
    },
    cic:{
      type: Sequelize.STRING,
    }
  });
  return Profile;
};
