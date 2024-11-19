const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const toppingController = require("../../../controllers/Users/topping.controller");
const { authorization , checkRole} = require("../../../auth/authUtils");
const router = express.Router();

router.get("/topping/getall/:id", asyncHandle(toppingController.getToppingByProduct))
router.put("/topping/:id",authorization,  checkRole(['seller','admin']),asyncHandle(toppingController.changeStatusTopping))
module.exports = router;
