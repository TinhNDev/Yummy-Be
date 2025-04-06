module.exports = (sequelize, Sequelize) => {
  const Review = sequelize.define('Review', {
    res_rating: Sequelize.INTEGER,
    dri_rating: Sequelize.INTEGER,
    res_comment: Sequelize.TEXT,
    dri_comment: Sequelize.TEXT,
  });
  return Review;
};
