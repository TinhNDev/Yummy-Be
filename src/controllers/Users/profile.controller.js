<<<<<<< HEAD
const { SuccessResponse } = require("../../core/success.response")
const { UpdateProfile } = require("../../services/Users/profile.service")

class ProfileController {
    UpdateProfile = async (req,res,next)=>{
        new SuccessResponse({
            message: "update successfully",
            metadata: await UpdateProfile({
                user_id: req.user.user_id,
                body: req.body.profile,
                address: req.body.address,
            })
        }).send(res);
    }
}
=======
const { SuccessResponse } = require("../../core/success.response")
const { UpdateProfile } = require("../../services/Users/profile.service")

class ProfileController {
    UpdateProfile = async (req,res,next)=>{
        new SuccessResponse({
            message: "update successfully",
            metadata: await UpdateProfile({
                user_id: req.user.user_id,
                body: req.body.profile,
                address: req.body.address,
            })
        }).send(res);
    }
}
>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
module.exports  =new  ProfileController();