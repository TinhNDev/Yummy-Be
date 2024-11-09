const { SuccessResponse } = require("../../../core/success.response")
const { createOrder, verifyCallback, checkStatusOrder } = require("../../../services/Users/Customers/payment.service")

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
            metadata: await verifyCallback({
                dataStr:req.body.data,
                reqMac:req.body.mac,
            })
        }).send(res)
    }
    checkStatus = async(req,res,next) =>{
        new SuccessResponse({
            message: "status",
            metadata: await checkStatusOrder({
                app_trans_id: req.body.app_trans_id
            })
        }).send(res)
    }
}

module.exports = new PaymentController();