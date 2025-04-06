const express = require('express');
const { authorization, checkRole } = require('../../auth/authUtils');
const { asyncHandle } = require('../../helper/asyncHandler');
const adminController = require('../../controllers/admin/admin.controller');
const router = express.Router();

router.get(
  '/admin/restaurant',
  authorization,
  checkRole(['admin']),
  asyncHandle(adminController.getAllRestaurant)
);
router.put(
  '/admin/restaurant/:restaurant_id',
  authorization,
  checkRole(['admin']),
  asyncHandle(adminController.changeStatusRes)
);
router.get(
  '/admin/driver',
  authorization,
  checkRole(['admin']),
  asyncHandle(adminController.getAllDriver)
);
router.get(
  '/admin/:driver_id/driver',
  authorization,
  checkRole(['admin']),
  asyncHandle(adminController.getDetailDriverForAdmin)
);
router.put(
  '/admin/driver/:driver_id',
  authorization,
  checkRole(['admin']),
  asyncHandle(adminController.changeStatusDriver)
);
module.exports = router;
