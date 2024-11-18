"use strict"
const express = require('express');
const { authorization,checkRole } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const profileController = require('../../../controllers/Users/profile.controller');
const router = express.Router();

router.put("/profile",authorization,checkRole(['user', 'driver', 'admin']),asyncHandle(profileController.UpdateProfile))
router.get("/profile", authorization,checkRole(['user', 'driver', 'admin']),asyncHandle(profileController.GetProfile))
module.exports = router;