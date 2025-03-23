const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const { authorization, checkRole } = require("../../../auth/authUtils");
const {
  createReview,
  getReviewsOfDriver,
  getReviewsOfRestaurant,
} = require("../../../controllers/Users/review.controller");

const router = express.Router();

router.post(
  "/review/:order_id",
  authorization,
  checkRole(["user"]),
  asyncHandle(createReview)
);
router.get(
  "/review/:driver_id/driver",
  authorization,
  checkRole(["user","seller"]),
  asyncHandle(getReviewsOfDriver)
);
router.get(
  "/review/:restaurant_id/restaurant",
  authorization,
  checkRole(["user","driver"]),
  asyncHandle(getReviewsOfRestaurant)
);

module.exports = router;
