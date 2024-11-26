const express = require('express');
const { authorization, checkRole } = require('../../auth/authUtils');
const { asyncHandle } = require('../../helper/asyncHandler');
const adminController = require('../../controllers/admin/admin.controller');
const router = express.Router();

router.get("/admin/restaurant", authorization,checkRole(['admin']),asyncHandle(adminController.getAllRestaurant));

module.exports = router;