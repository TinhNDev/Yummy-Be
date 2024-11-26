// src/controllers/Users/review.controller.js
const { SuccessResponse } = require("../../core/success.response");
const ReviewService = require("../../services/Users/reviews.service");

class ReviewController {
  // Tạo đánh giá mới
  createReview = async (req, res, next) => {

    const newReview = await ReviewService.createReview({
      user_id:req.user.user_id,
      reviews: req.body.reviews,
      order_id: req.params.order_id
    });

    new SuccessResponse({
      message: "Create review success",
      metadata: newReview,
    }).send(res);
  };
}

module.exports = new ReviewController();