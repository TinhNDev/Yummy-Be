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
module.exports  =new  ProfileController();