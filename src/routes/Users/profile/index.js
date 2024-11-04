"use strict"
const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const profileController = require('../../../controllers/Users/profile.controller');
const router = express.Router();

router.put("/profile",authorization,asyncHandle(profileController.UpdateProfile))

module.exports = router;