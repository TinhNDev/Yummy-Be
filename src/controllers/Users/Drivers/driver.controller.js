const { SuccessResponse } = require("../../../core/success.response")
const DriverService = require("../../../services/Users/Drivers")

class DriverController{
    updateInformation = async(req, res) =>{
        new SuccessResponse({
            message:"update successfuly",
            metadata: await DriverService.updateInformation({
                user_id:req.user.user_id,
                body: req.body.driver
            })
        }).send(res)
    }
}

module.exports = new DriverController();