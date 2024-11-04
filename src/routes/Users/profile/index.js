<<<<<<< HEAD
"use strict"
const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const profileController = require('../../../controllers/Users/profile.controller');
const router = express.Router();

router.put("/profile",authorization,asyncHandle(profileController.UpdateProfile))

=======
"use strict"
const express = require('express');
const { authorization } = require('../../../auth/authUtils');
const { asyncHandle } = require('../../../helper/asyncHandler');
const profileController = require('../../../controllers/Users/profile.controller');
const router = express.Router();

router.put("/profile",authorization,asyncHandle(profileController.UpdateProfile))

>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
module.exports = router;