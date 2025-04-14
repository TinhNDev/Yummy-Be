const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const {
  addToCart,
  getItemInCart,
  removeFromCart,
  getAllCart,
} = require('../../../controllers/Users/cart.controller');
const router = express.Router();

router.post('/cart', authorization, asyncHandle(addToCart));
router.put('/cart', authorization, asyncHandle(removeFromCart));
router.get('/cart/:restaurant_id', authorization, asyncHandle(getItemInCart));
router.get('/cart', authorization, asyncHandle(getAllCart));

module.exports = router;
