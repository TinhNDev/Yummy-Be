const express = require('express');
const { asyncHandle } = require('../../../helper/asyncHandler');
const { authorization, checkRole } = require('../../../auth/authUtils');
const { getAllOrderForCustomer ,getOrderForCustomer, getDistanceByResId} = require('../../../controllers/Users/Customers/index.controller');
const router = express.Router();

router.get("/customer/all/order", authorization,checkRole(['user']),asyncHandle(getAllOrderForCustomer))
router.get("/customer/:order_id/order", authorization, checkRole(['user']),asyncHandle(getOrderForCustomer));
router.get("/customer/:userLatitude/:userLongtitude/:restaurant_id",asyncHandle(getDistanceByResId))
module.exports = router;