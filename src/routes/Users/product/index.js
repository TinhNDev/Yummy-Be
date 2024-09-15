"use strict";

const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const productController = require('../../../controllers/Users/product.controller');
const router = express.Router();

//authorization
router.use(authorization);
//
router.post("/products", asyncHandle(productController.CreateProduct));
router.put("/products/:id", asyncHandle(productController.UpdateProduct))
module.exports = router;