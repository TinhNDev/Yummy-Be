<<<<<<< HEAD
const { SuccessResponse } = require("../../core/success.response")
const { SetDefaultAddress } = require("../../services/Users/address.service")

class AddressController{
    SetDefaultAddress = async (req,res,next) =>{
        new SuccessResponse({
            message: "set default",
            metadata: await SetDefaultAddress({
                user_id: req.user.user_id,
                address_id: req.body.address_id
            })
        }).send(res)
    }
}

=======
const { SuccessResponse } = require("../../core/success.response")
const { SetDefaultAddress } = require("../../services/Users/address.service")

class AddressController{
    SetDefaultAddress = async (req,res,next) =>{
        new SuccessResponse({
            message: "set default",
            metadata: await SetDefaultAddress({
                user_id: req.user.user_id,
                address_id: req.body.address_id
            })
        }).send(res)
    }
}

>>>>>>> ba1ec96e9f13d8946d170ae05d9691d1754d1aa7
module.exports = new AddressController;