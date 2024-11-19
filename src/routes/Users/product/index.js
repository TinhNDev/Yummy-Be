"use strict";

const express = require('express');
const { authorization,checkRole } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const productController = require('../../../controllers/Users/product.controller');
const router = express.Router();
//search by user
router.get("/products/:id/restaurantId",asyncHandle(productController.getListProductForUser))
router.get("/products/restaurantId",authorization,checkRole(['seller','admin']),asyncHandle(productController.getListProductForRes))
router.get("/products/search/:keySearch",asyncHandle(productController.GetListSearchProduct))
router.get("/products",asyncHandle(productController.FindAllProducts))
router.get("/products/:product_id",asyncHandle(productController.FindProduct))

router.post("/products",authorization, checkRole(['seller','admin']),asyncHandle(productController.CreateProduct));
router.put("/products/:id",authorization, checkRole(['seller','admin']),asyncHandle(productController.UpdateProduct));
router.post("/products/public/:id", authorization,checkRole(['seller','admin']),asyncHandle(productController.PublicProductByShop))
router.post("/products/unpublic/:id",authorization,checkRole(['seller','admin']),asyncHandle(productController.DraftProductByRestaurant))

router.get("/products/draft/all",authorization,checkRole(['seller','admin']),asyncHandle(productController.GetAllDraftsForShop))
router.get("/products/public/all",authorization,checkRole(['seller','admin']),asyncHandle(productController.GetAllPublicForShop))
module.exports = router;