<<<<<<< HEAD
module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define("Address", {
    address_x: {
      type: Sequelize.STRING,
    },
    address_y: {
      type: Sequelize.STRING,
    },
    is_default: {
      type: Sequelize.BOOLEAN,
    },
  });
  return Address;
};
=======
module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define("Address", {
    address_x: {
      type: Sequelize.STRING,
    },
    address_y: {
      type: Sequelize.STRING,
    },
    is_default: {
      type: Sequelize.BOOLEAN,
    },
  });
  return Address;
};
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
