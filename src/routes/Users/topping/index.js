<<<<<<< HEAD
const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const toppingController = require("../../../controllers/Users/topping.controller");
const router = express.Router();

router.get("/topping/getall/:id", asyncHandle(toppingController.getToppingByProduct))
module.exports = router;
=======
const express = require("express");
const { asyncHandle } = require("../../../helper/asyncHandler");
const toppingController = require("../../../controllers/Users/topping.controller");
const router = express.Router();

router.get("/topping/getall/:id", asyncHandle(toppingController.getToppingByProduct))
module.exports = router;
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
