<<<<<<< HEAD
const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const cartController = require('../../../controllers/Users/Customers/cart.controller');
const router = express.Router();

router.post("/cart", authorization, asyncHandle(cartController.AddToCart));

module.exports = router
=======
const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const cartController = require('../../../controllers/Users/Customers/cart.controller');
const router = express.Router();

router.post("/cart", authorization, asyncHandle(cartController.AddToCart));

module.exports = router;
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
