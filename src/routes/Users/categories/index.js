<<<<<<< HEAD

const express = require('express');
const { asyncHandle } = require('../../../helper/asyncHandler');
const CatergoriesController = require('../../../controllers/Users/categories.controller');
const router = express.Router();
router.get("/categories", asyncHandle(CatergoriesController.getAllCategories));
router.get("/categories/:id", asyncHandle(CatergoriesController.getCategoriesByProduct));

router.get("/categories/product/all",asyncHandle(CatergoriesController.getListProductById));
router.get("/categories/:id/products", asyncHandle(CatergoriesController.getProductByCategoryId));
=======

const express = require('express');
const { asyncHandle } = require('../../../helper/asyncHandler');
const CatergoriesController = require('../../../controllers/Users/categories.controller');
const router = express.Router();
router.get("/categories", asyncHandle(CatergoriesController.getAllCategories));
router.get("/categories/:id", asyncHandle(CatergoriesController.getCategoriesByProduct));

router.get("/categories/product/all",asyncHandle(CatergoriesController.getListProductById));
router.get("/categories/:id/products", asyncHandle(CatergoriesController.getProductByCategoryId));
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
module.exports = router;