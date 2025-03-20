const db = require("../../models/index.model");
class ReviewService {
  static createReview = async ({ user_id, order_id, reviews }) => {
    const order = await db.Order.findOne({ where: { id: order_id } });
    const customer = await db.Customer.findOne({
      include: {
        model: db.Profile,
        where: { user_id: user_id },
      },
    });
    
    return await db.Review.create({
      res_rating: reviews.res_rating,
      dri_rating: reviews.dri_rating,
      res_comment: reviews.res_comment,
      dri_comment: reviews.dri_comment,
      customer_id: customer.id,
      driver_id: order.driver_id,
      restaurant_id: order.restaurant_id,
    });
  };

  static getReviewOfRestaurant = async ({ restaurant_id }) => {
    const reviews = await db.Review.findAll({
      where: { restaurant_id: restaurant_id },
    });
    return reviews ? reviews : [];
  };

  static getReviewOfDriver = async ({ driver_id }) => {
    const reviews = await db.Review.findAll({
      where: { driver_id: driver_id },
    });
    return reviews ? reviews : [];
  };
}

module.exports = ReviewService;
