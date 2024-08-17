const express = require("express");
const { apiKey, permissions }=require("../auth/checkAuth");

const router = express.Router();
//check apiKey
router.use(apiKey);
//check permisson
router.use(permissions("0000"));

// folder access dùng để quản lý các file liên quan với truy cập(signUp,SignIn)
router.use("/v1/api", require("./Users/access"));
module.exports = router;
