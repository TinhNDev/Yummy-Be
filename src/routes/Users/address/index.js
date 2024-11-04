<<<<<<< HEAD
const express = require('express')
const { asyncHandle } = require('../../../helper/asyncHandler')
const { SetDefaultAddress } = require('../../../controllers/Users/address.controller')
const router = express.Router()
const { authorization } = require('../../../auth/authUtils');
router.post("/address",authorization,asyncHandle(SetDefaultAddress));
=======
const express = require('express')
const { asyncHandle } = require('../../../helper/asyncHandler')
const { SetDefaultAddress } = require('../../../controllers/Users/address.controller')
const router = express.Router()
const { authorization } = require('../../../auth/authUtils');
router.post("/address",authorization,asyncHandle(SetDefaultAddress));
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
module.exports = router;