<<<<<<< HEAD
module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define("Categories", {
    name: {
      type: Sequelize.STRING,
    },
    thumnail:{
      type: Sequelize.STRING,
    },
    description:{
      type: Sequelize.STRING,
    }
  });
  return Categories;
};
=======
module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define("Categories", {
    name: {
      type: Sequelize.STRING,
    },
    thumnail:{
      type: Sequelize.STRING,
    },
    description:{
      type: Sequelize.STRING,
    }
  });
  return Categories;
};
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
