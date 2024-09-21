"use strict";

const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const productController = require('../../../controllers/Users/product.controller');
const router = express.Router();
//search by user
router.get("/products/search/:keySearch",asyncHandle(productController.GetListSearchProduct))
router.get("/products",asyncHandle(productController.FindAllProducts))
router.get("/products/:product_id",asyncHandle(productController.FindProduct))
//authorization
router.use(authorization);
//
router.post("/products", asyncHandle(productController.CreateProduct));
router.put("/products/:id", asyncHandle(productController.UpdateProduct));
router.post("/products/public/:id", asyncHandle(productController.PublicProductByShop))
router.post("/products/unpublic/:id",asyncHandle(productController.DraftProductByRestaurant))

router.get("/products/draft/all",asyncHandle(productController.GetAllDraftsForShop))
router.get("/products/public/all",asyncHandle(productController.GetAllPublicForShop))
module.exports = router;