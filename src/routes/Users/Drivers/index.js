const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const driverController = require('../../../controllers/Users/Drivers/driver.controller');
const router = express.Router();

router.put("/driver", authorization, asyncHandle(driverController.updateInformation))
router.get("/driver/reject/:orderId",authorization,asyncHandle(driverController.rejectOrder))
router.get("/drver/accept/:orderId",authorization,asyncHandle(driverController.acceptOrder))
module.exports = router