"use strict";
const express = require("express");
const { apiKey, permissions } = require("../auth/checkAuth");
//callbackzalo
const { asyncHandle } = require("../helper/asyncHandler");
const paymentController = require("../controllers/Users/Customers/payment.controller");
const { KeyToken, User } = require("../models/index.model");
const userModel = require("../models/Users/user.model");
const router = express.Router();
router.get("/verify-email", async (req, res) => {
  const { id_token } = req.query;
  const userToVerifyEmail = await KeyToken.findOne({
    where: { id: id_token },
  });

  if (!userToVerifyEmail) {
    return res.send("Invalid verification token");
  }
  res.send({
    accessToken: userToVerifyEmail.accessToken,
    refreshToken: userToVerifyEmail.refreshToken,
  });
});
router.get("/verify-password", async (req, res) => {
  const { id_token, password } = req.query;

  const userToVerifyEmail = await KeyToken.findOne({
    where: { id: id_token },
  });

  await User.update(
    { password: password },
    { where: { id: userToVerifyEmail.user_id } }
  );

  if (!userToVerifyEmail) {
    return res.send("Invalid verification token");
  }

  res.send({
    accessToken: userToVerifyEmail.accessToken,
    refreshToken: userToVerifyEmail.refreshToken,
  });
});
router.post("/callback", asyncHandle(paymentController.callBack));
//check apiKey
router.use(apiKey);
//check permisson
router.use(permissions("0000"));

// folder access dùng để quản lý các file liên quan với truy cập(signUp,SignIn)

router.use("/v1/api", require("./Users/product"));
router.use("/v1/api", require("./Users/categories"));
router.use("/v1/api", require("./Users/profile"));
router.use("/v1/api", require("./Users/access"));
router.use("/v1/api", require("./Users/address"));
router.use("/v1/api", require("./Users/restaurants"));
router.use("/v1/api", require("./Users/topping"));
router.use("/v1/api", require("./Users/Customers/cart"));
router.use("/v1/api", require("./Users/Customers/payment"));
router.use("/v1/api", require("./Users/restaurants/orderRestaurant"));
router.use("/v1/api", require("./Users/Drivers"));
router.use("/v1/api", require("./Users/cupon"));
router.use("/v1/api", require("./Users/review"));
router.use("/v1/api", require("./Users/Customers/index"));
router.use("/v1/api", require("./Admin/index"));
router.use("/v1/api", require("./llm/index"));
module.exports = router;
