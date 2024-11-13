const { SuccessResponse } = require("../../../core/success.response")
const OrderRestaunrantService = require("../../../services/Users/Restaurants/index.service")

class OrderRestaunrantController{
    getOrder = async(req,res,next) =>{
        new SuccessResponse({
            message:"all order",
            metadata: await OrderRestaunrantService.getOrder({
                restaurant_id: req.user.user_id
            })
        }).send(res)
    }
    changeStatusOrder = async(req, res)=>{
        new SuccessResponse({
            message:"change status",
            metadata: await OrderRestaunrantService.changeStatusOrder({
                restaurant_id:req.user.user_id,
                orderId: req.body.orderId,
                status: req.body.status
            })
        }).send(res)
    }
}

module.exports =new OrderRestaunrantController();