const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const toppingController = require("../../../controllers/Users/topping.controller");
const router = express.Router();

router.get("/topping/getall/:id", asyncHandle(toppingController.getToppingByProduct))
module.exports = router;
