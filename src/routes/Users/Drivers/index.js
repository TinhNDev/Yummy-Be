const express = require('express');
const { authorization, checkRole } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const driverController = require('../../../controllers/Users/Drivers/driver.controller');
const router = express.Router();

router.put("/driver", authorization,checkRole(['driver','admin']) ,asyncHandle(driverController.updateInformation))
router.get("/driver/detail",authorization,checkRole(['driver','admin']),asyncHandle(driverController.getProfileDriver))
router.get("/driver/reject/:orderId",checkRole(['driver','admin']),authorization,asyncHandle(driverController.rejectOrder))
router.get("/driver/accept/:orderId",checkRole(['driver','admin']),authorization,asyncHandle(driverController.acceptOrder))
router.get("/driver/confirm/:orderId",checkRole(['driver','admin']),authorization,asyncHandle(driverController.confirmOrder))
module.exports = router