// src/controllers/Users/review.controller.js
const { SuccessResponse } = require("../../core/success.response");
const ReviewService = require("../../services/Users/reviews.service");

class ReviewController {
  // Tạo đánh giá mới
  createReview = async (req, res, next) => {
    const { res_rating, dri_rating, res_comment, dri_comment } = req.body;
    const user_id = req.user.user_id;
    const newReview = await ReviewService.createReview({
      user_id,
      res_rating,
      dri_rating,
      res_comment,
      dri_comment,
    });

    new SuccessResponse({
      message: "Create review success",
      metadata: newReview,
    }).send(res);
  };
}

module.exports = new ReviewController();