"use strict";

const express = require("express");
const accessController = require("../../../controllers/Users/access.controller");
const { asyncHandle } = require("../../../helper/asyncHandler");
const { authorization } = require("../../../auth/authUtils");
const router = express.Router();
//signup
router.post("/user/signup", asyncHandle(accessController.singUp));

//singin
router.post("/user/login", asyncHandle(accessController.login));

//logout
router.post(
  "/user/logout",
  authorization,
  asyncHandle(accessController.logout)
);
//forgot password
router.put(
  "/user/forgot-password",
  asyncHandle(accessController.forgotPassword)
);
router.post(
  "/user/handelRefeshToken",
  authorization,
  asyncHandle(accessController.refreshToken)
);
module.exports = router;
