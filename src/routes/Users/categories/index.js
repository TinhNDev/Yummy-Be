
const express = require('express');
const { asyncHandle } = require('../../../helper/asyncHandler');
const CatergoriesController = require('../../../controllers/Users/categories.controller');
const router = express.Router();
router.get("/categories", asyncHandle(CatergoriesController.getAllCategories));
router.get("/categories/:id", asyncHandle(CatergoriesController.getCategoryById));

router.get("/categories/product/all",asyncHandle(CatergoriesController.getListProductById));
router.get("/categories/:id/products", asyncHandle(CatergoriesController.getProductByCategoryId));
module.exports = router;