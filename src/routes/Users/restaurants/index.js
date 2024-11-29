const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const restaurantController = require("../../../controllers/Users/restaurant.controller");
const { authorization,checkRole } = require("../../../auth/authUtils");
const router = express.Router();

router.put(
  "/restaurant",
  authorization,
  checkRole(['seller','admin']),
  asyncHandle(restaurantController.updateRestaurant)
);
router.get(
  "/restaurant/detail",
  authorization,
  checkRole(['seller','admin']),
  asyncHandle(restaurantController.getDetailProRes)
);
router.get(
  "/restaurant/:restaurant_id/detail",
  asyncHandle(restaurantController.getDetailProResForUser)
);
router.get(
  "/restaurants/:userLatitude/:userLongitude",
  asyncHandle(restaurantController.getAllRestaurant)
);
module.exports = router;
