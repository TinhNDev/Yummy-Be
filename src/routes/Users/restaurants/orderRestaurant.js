const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const restaurantController = require("../../../controllers/Users/Restaurants/index.controller");
const { authorization ,checkRole} = require("../../../auth/authUtils");
const router = express.Router();

router.get(
  "/restaurant/order",
  authorization,
  checkRole(['seller']),
  asyncHandle(restaurantController.getOrder)
);
router.post("/restaurant/order/status",
  authorization,
  asyncHandle(restaurantController.changeStatusOrder)
)
router.get(
  "/restaurant/:order_id/driver",authorization, checkRole(['seller','admin']),asyncHandle(restaurantController.findDriver)
)
router.get("/restaurant/reject/:order_id/:reason",authorization, checkRole(['seller','admin']),asyncHandle(restaurantController.rejectOrder))
module.exports = router;
