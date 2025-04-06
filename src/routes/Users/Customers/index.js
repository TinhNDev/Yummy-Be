const express = require('express');
const { asyncHandle } = require('../../../helper/asyncHandler');
const { authorization, checkRole } = require('../../../auth/authUtils');
const {
  getAllOrderForCustomer,
  getOrderForCustomer,
  getDistanceByResId,
  addToFavoriteRestaurant,
  getLisFavoriteRes,
} = require('../../../controllers/Users/Customers/index.controller');
const router = express.Router();

router.get(
  '/customer/all/order',
  authorization,
  checkRole(['user']),
  asyncHandle(getAllOrderForCustomer)
);
router.get(
  '/customer/:order_id/order',
  authorization,
  checkRole(['user']),
  asyncHandle(getOrderForCustomer)
);
router.get(
  '/customer/:userLatitude/:userLongtitude/:restaurant_id',
  asyncHandle(getDistanceByResId)
);
router.post(
  '/customer/favoriteres',
  authorization,
  asyncHandle(addToFavoriteRestaurant)
);
router.get(
  '/customer/favoriteres',
  authorization,
  asyncHandle(getLisFavoriteRes)
);
module.exports = router;
