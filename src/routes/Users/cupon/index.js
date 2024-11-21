const express = require('express');
const { asyncHandle } = require('../../../helper/asyncHandler');
const cuponController = require('../../../controllers/Users/cupon.controller');

const router = express.Router();

router.get("/cupon", asyncHandle(cuponController.getCupon))

module.exports = router