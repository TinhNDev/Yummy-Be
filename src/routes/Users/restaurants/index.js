const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const restaurantController = require("../../../controllers/Users/restaurant.controller");
const { authorization } = require("../../../auth/authUtils");
const router = express.Router();

router.put(
  "/restaurant",
  authorization,
  asyncHandle(restaurantController.updateRestaurant)
);
router.get(
  "/restaurant/detail",
  authorization,
  asyncHandle(restaurantController.getDetailProRes)
);
router.get(
  "/restaurants/:userLatitude/:userLongitude",
  asyncHandle(restaurantController.getAllRestaurant)
);
module.exports = router;
