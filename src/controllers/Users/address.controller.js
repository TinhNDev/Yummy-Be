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

module.exports = new AddressController;