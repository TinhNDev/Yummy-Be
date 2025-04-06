// src/controllers/Users/review.controller.js
const { SuccessResponse } = require('../../core/success.response');
const ReviewService = require('../../services/Users/reviews.service');

class ReviewController {
  // Tạo đánh giá mới
  createReview = async (req, res, next) => {
    const newReview = await ReviewService.createReview({
      user_id: req.user.user_id,
      reviews: req.body.reviews,
      order_id: req.params.order_id,
    });

    new SuccessResponse({
      message: 'Create review success',
      metadata: newReview,
    }).send(res);
  };

  getReviewsOfRestaurant = async (req, res) => {
    const { restaurant_id } = req.params;
    new SuccessResponse({
      message: 'reviews of res',
      metadata: await ReviewService.getReviewOfRestaurant({ restaurant_id }),
    }).send(res);
  };

  getReviewsOfDriver = async (req, res) => {
    const { driver_id } = req.params;
    new SuccessResponse({
      message: 'reviews of driver',
      metadata: await ReviewService.getReviewOfDriver({ driver_id }),
    }).send(res);
  };
}

module.exports = new ReviewController();
