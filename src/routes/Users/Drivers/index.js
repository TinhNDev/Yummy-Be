const express = require('express');
const { authorization, checkRole } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const driverController = require('../../../controllers/Users/Drivers/driver.controller');
const router = express.Router();

router.put(
  '/driver',
  authorization,
  checkRole(['driver', 'admin']),
  asyncHandle(driverController.updateInformation)
);
router.get(
  '/driver/detail',
  authorization,
  checkRole(['driver']),
  asyncHandle(driverController.getProfileDriver)
);
router.get(
  '/driver/:driver_id/detail',
  authorization,
  asyncHandle(driverController.getDetailToHis)
);
router.get(
  '/driver/reject/:orderId',
  authorization,
  checkRole(['driver', 'admin']),
  asyncHandle(driverController.rejectOrder)
);
router.get(
  '/driver/accept/:orderId',
  authorization,
  checkRole(['driver', 'admin']),
  asyncHandle(driverController.acceptOrder)
);
router.get(
  '/driver/confirm/:orderId',
  authorization,
  checkRole(['driver', 'admin']),
  asyncHandle(driverController.confirmOrder)
);
router.get(
  '/driver/:driver_id/order',
  authorization,
  checkRole(['driver', 'admin']),
  asyncHandle(driverController.getAllOrderForDriver)
);
router.put(
  '/driver/:driver_id',
  authorization,
  checkRole(['driver', 'admin']),
  asyncHandle(driverController.changeStatus)
);
router.get(
  '/driver/give/:orderId',
  authorization,
  checkRole(['driver', 'admin']),
  asyncHandle(driverController.giveOrder)
);
module.exports = router;
