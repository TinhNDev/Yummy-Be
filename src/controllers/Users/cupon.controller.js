const { SuccessResponse } = require("../../core/success.response")
const CuponService = require("../../services/Users/cupon.service")

class CuponController{
    getCupon = async(req,res)=>{
        new SuccessResponse({
            message: "123",
            metadata: await CuponService.getCupon()
        }).send(res);
    }
}

module.exports = new CuponController();