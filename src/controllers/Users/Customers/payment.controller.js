const { SuccessResponse } = require("../../../core/success.response")
const { createOrder, verifyCallback } = require("../../../services/Users/Customers/payment.service")

class PaymentController{
    createOrder = async(req,res, next) =>{
        new SuccessResponse({
            message:"create order",
            metadata: await createOrder({
                user_id:req.user.user_id,
                order: req.body.order,
            })
        }).send(res);
    }
    callBack = async(req, res, next) =>{
        new SuccessResponse({
            message: "call back",
            metadata: verifyCallback({
                dataStr:req.body.data,
                reqMac:req.body.mac,
            })
        }).send(res)
    }
}

module.exports = new PaymentController();