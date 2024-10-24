const express = require('express');
const { asyncHandle } = require('../../../helper/asyncHandler');
const restaurantController = require('../../../controllers/Users/restaurant.controller');
const { authorization } = require('../../../auth/authUtils');
const router = express.Router();

router.put("/restaurant",authorization,asyncHandle(restaurantController.updateRestaurant));

module.exports = router;
