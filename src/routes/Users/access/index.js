const express=require('express')
const accessController = require('../../../controllers/Users/access.controller')
const {asyncHandle}=require('../../../helper/asyncHandler')
const router = express.Router();
//signup
router.post("/user/signup",asyncHandle(accessController.singUp))

module.exports=router;