"use strict";

const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const productController = require('../../../controllers/Users/product.controller');
const router = express.Router();
//search by user
router.get("/products/:id/restaurantId",asyncHandle(productController.getListProductForUser))
router.get("/products/restaurantId",authorization,asyncHandle(productController.getListProductForRes))
router.get("/products/search/:keySearch",asyncHandle(productController.GetListSearchProduct))
router.get("/products",asyncHandle(productController.FindAllProducts))
router.get("/products/:product_id",asyncHandle(productController.FindProduct))

router.post("/products",authorization, asyncHandle(productController.CreateProduct));
router.put("/products/:id",authorization, asyncHandle(productController.UpdateProduct));
router.post("/products/public/:id", authorization,asyncHandle(productController.PublicProductByShop))
router.post("/products/unpublic/:id",authorization,asyncHandle(productController.DraftProductByRestaurant))

router.get("/products/draft/all",authorization,asyncHandle(productController.GetAllDraftsForShop))
router.get("/products/public/all",authorization,asyncHandle(productController.GetAllPublicForShop))
module.exports = router;