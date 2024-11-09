"use strict";
const express = require("express");
const { apiKey, permissions }=require("../auth/checkAuth");
//callbackzalo
const { asyncHandle } = require('../helper/asyncHandler');
const paymentController = require('../controllers/Users/Customers/payment.controller');
const router = express.Router();
router.post("/callback", asyncHandle(paymentController.callBack))
//check apiKey
router.use(apiKey);
//check permisson
router.use(permissions("0000"));

// folder access dùng để quản lý các file liên quan với truy cập(signUp,SignIn)

router.use("/v1/api", require("./Users/product"));
router.use("/v1/api", require("./Users/categories"))
router.use("/v1/api", require("./Users/profile"))
router.use("/v1/api", require("./Users/access"));
router.use("/v1/api", require("./Users/address"));
router.use("/v1/api", require("./Users/restaurants"))
router.use("/v1/api", require("./Users/topping"))
router.use("/v1/api", require("./Users/Customers/cart"))
router.use("/v1/api", require("./Users/Customers/payment"))
router.use("", require("./Users/Customers/test"))
module.exports = router;
