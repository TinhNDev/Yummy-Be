const express = require('express')
const { asyncHandle } = require('../../../helper/asyncHandler')
const { SetDefaultAddress } = require('../../../controllers/Users/address.controller')
const router = express.Router()
const { authorization } = require('../../../auth/authUtils');
router.post("/address",authorization,asyncHandle(SetDefaultAddress));
module.exports = router;