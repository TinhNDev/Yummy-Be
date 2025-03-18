const { SuccessResponse } = require("../../core/success.response")
const { UpdateProfile, getProfie } = require("../../services/Users/profile.service")

class ProfileController {
    UpdateProfile = async (req,res,next)=>{
        new SuccessResponse({
            message: "update successfully",
            metadata: await UpdateProfile({
                user_id: req.user.user_id,
                body: req.body.profile,
            })
        }).send(res);
    }
    GetProfile = async (req, res, next) =>{
        new SuccessResponse({
            message: "Profile user",
            metadata: await getProfie(req.user.user_id)
        }).send(res)
    }
}
module.exports  =new  ProfileController();