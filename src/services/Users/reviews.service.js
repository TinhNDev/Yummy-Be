const db = require("../../models/index.model");
class ReviewService {
  static createReview = async ({ user_id, order_id, reviews }) => {
    const order = await db.Order.findOne({ where: { id: order_id } });
    const Customer =await db.User.findOne({
      where: { id: user_id },
      includes: [
        {
          model: db.Profile,
          as: "Profile",
          includes: [
            {
              model: db.Customer,
              as: "Customer"
            },
          ],
        },
      ],
    });
    return await db.Review.create({
      res_rating: reviews.res_rating,
      dri_rating: reviews.dri_rating,
      res_comment: reviews.res_comment,
      dri_comment: reviews.dri_comment,
      customer_id: Customer.id,
      driver_id: order.driver_id,
      restaurant_id: order.restaurant_id,
    });
  };
}

module.exports = ReviewService;