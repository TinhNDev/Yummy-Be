
const express = require('express');
const { asyncHandle } = require('../../../helper/asyncHandler');
const CatergoriesController = require('../../../controllers/Users/categories.controller');
const router = express.Router();

router.get("/categories/all",asyncHandle(CatergoriesController.getListProductById));
router.get("/categories/:id",asyncHandle(CatergoriesController.getProductByCategoryId));
module.exports = router;