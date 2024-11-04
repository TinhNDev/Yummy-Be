<<<<<<< HEAD
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
  "/restaurant/all",
  asyncHandle(restaurantController.getAllRestaurant)
);
module.exports = router;
=======
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
  "/restaurant/all",
  asyncHandle(restaurantController.getAllRestaurant)
);
module.exports = router;
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
