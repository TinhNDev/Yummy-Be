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
    rejectOrder = async(req, res)=>{
        new SuccessResponse({
            message:" reject order",
            metadata: await DriverService.rejectOrder({
                driver_id: req.user.user_id,
                order_id : req.params.orderId,
            })
        }).send(res)
    }
}

module.exports = new DriverController();