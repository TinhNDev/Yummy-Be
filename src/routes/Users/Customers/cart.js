const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const cartController = require('../../../controllers/Users/Customers/cart.controller');
const router = express.Router();

router.post("/cart", authorization, asyncHandle(cartController.AddToCart));

module.exports = router