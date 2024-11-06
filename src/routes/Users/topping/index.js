const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const toppingController = require("../../../controllers/Users/topping.controller");
const router = express.Router();

router.get("/topping/getall/:id", asyncHandle(toppingController.getToppingByProduct))
router.put("/toping/:id", asyncHandle(toppingController.changeStatusTopping))
module.exports = router;
