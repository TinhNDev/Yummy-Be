const express = require('express');
const { asyncHandle } = require('../../../helper/asyncHandler');
const { authorization, checkRole } = require('../../../auth/authUtils');
const { createReview } = require('../../../controllers/Users/review.controller');

const router = express.Router();

router.post("/review/:order_id",authorization,checkRole(['user']),asyncHandle(createReview));

module.exports = router;